import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    return res.status(201).json({
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(400).json({
      message: "User allaqachon mavjud",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Noto‘g‘ri login/parol",
      });
    }

    return res.json({
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server xatoligi",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("getMe xatosi:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    const updateData = {};

    if (username !== undefined) {
      updateData.username = username;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Joriy parolni kiriting" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Joriy parol noto‘g‘ri" });
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Hech qanday ma'lumot yuborilmadi" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, username: true, email: true },
    });

    res.json({
      message: "Profil muvaffaqiyatli yangilandi",
      user: {
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("updateMe xatosi:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};
