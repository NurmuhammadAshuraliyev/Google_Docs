import prisma from "../config/db.js";
import { verifyToken } from "../utils/jwt.js";

const activeNotes = new Map();

const setupSockets = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Auth kerak"));
    }

    try {
      const user = verifyToken(token);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Noto‘g‘ri token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.username} ulandi`);

    socket.on("join-note", async ({ noteId }) => {
      try {
        const id = Number(noteId);

        const note = await prisma.note.findFirst({
          where: {
            id,
            OR: [
              { ownerId: socket.user.id },
              {
                collaborators: {
                  some: { userId: socket.user.id },
                },
              },
            ],
          },
        });

        if (!note) {
          return socket.emit("error", "Note ga kirish huquqi yo‘q");
        }

        socket.join(`note-${id}`);
        socket.noteId = id;

        const usersInRoom = Array.from(
          io.sockets.adapter.rooms.get(`note-${id}`) || [],
        )
          .map((id) => io.sockets.sockets.get(id)?.user?.username)
          .filter(Boolean);

        io.to(`note-${id}`).emit("online-users", usersInRoom);
      } catch (err) {
        socket.emit("error", "Xatolik yuz berdi");
      }
    });

    socket.on("content-change", async ({ noteId, content, cursor }) => {
      const id = Number(noteId);

      socket.to(`note-${id}`).emit("content-updated", {
        content,
        cursor,
        user: socket.user.username,
      });

      if (activeNotes.has(id)) {
        clearTimeout(activeNotes.get(id));
      }

      const timer = setTimeout(async () => {
        try {
          const note = await prisma.note.findUnique({
            where: { id },
          });

          if (!note) return;

          const versionCount = await prisma.version.count({
            where: { noteId: id },
          });

          await prisma.version.create({
            data: {
              noteId: id,
              content,
              version: versionCount + 1,
              changedBy: socket.user.id,
            },
          });

          const versions = await prisma.version.findMany({
            where: { noteId: id },
            orderBy: { changedAt: "desc" },
          });

          if (versions.length > 5) {
            await prisma.version.deleteMany({
              where: {
                id: {
                  in: versions.slice(5).map((v) => v.id),
                },
              },
            });
          }

          await prisma.note.update({
            where: { id },
            data: {
              content,
              updatedAt: new Date(),
            },
          });
        } catch (e) {
          console.error("Save error:", e);
        }
      }, 800);

      activeNotes.set(id, timer);
    });

    socket.on("cursor-move", ({ noteId, cursor }) => {
      const id = Number(noteId);

      socket.to(`note-${id}`).emit("cursor-updated", {
        user: socket.user.username,
        cursor,
      });
    });

    socket.on("add-comment", async ({ noteId, content }) => {
      try {
        const comment = await prisma.comment.create({
          data: {
            noteId: parseInt(noteId),
            userId: socket.user.id,
            content,
          },
          include: { user: { select: { username: true } } },
        });

        io.to(`note-${noteId}`).emit("new-comment", {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          user: { username: socket.user.username },
        });
      } catch (err) {
        socket.emit("error", { message: "Comment qo‘shishda xatolik" });
      }
    });

    socket.on("disconnect", () => {
      if (socket.noteId) {
        const room = `note-${socket.noteId}`;

        const users = Array.from(io.sockets.adapter.rooms.get(room) || [])
          .map((id) => io.sockets.sockets.get(id)?.user?.username)
          .filter(Boolean);

        io.to(room).emit("online-users", users);
      }

      console.log(`User ${socket.user.username} chiqdi`);
    });
  });
};

export default setupSockets;
