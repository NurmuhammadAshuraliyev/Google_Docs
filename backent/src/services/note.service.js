import prisma from "../config/db.js";

export const createNote = async (ownerId, title) => {
  return prisma.note.create({
    data: {
      title: title || "Yangi hujjat",
      content: { ops: [{ insert: "\n" }] },
      ownerId,
      versions: {
        create: {
          content: { ops: [{ insert: "\n" }] },
          version: 1,
          changedBy: ownerId,
        },
      },
    },
    include: { owner: true },
  });
};

export const getMyNotes = async (userId) => {
  return prisma.note.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: {
      owner: true,
      collaborators: { include: { user: true } },
    },
  });
};

export const getNoteById = async (noteId, userId) => {
  const id = Number(noteId);

  return prisma.note.findFirst({
    where: {
      id,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: {
      owner: true,
      collaborators: { include: { user: true } },
      versions: {
        orderBy: { changedAt: "desc" },
        take: 5,
      },
    },
  });
};

export const deleteNote = async (noteId, userId) => {
  const id = Number(noteId);

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) throw new Error("Note topilmadi");

  if (note.ownerId !== userId) {
    throw new Error("Faqat owner o‘chira oladi");
  }

  return prisma.note.delete({
    where: { id },
  });
};

export const addCollaborator = async (noteId, ownerId, email) => {
  const id = Number(noteId);

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new Error("Note topilmadi");

  if (note.ownerId !== ownerId) {
    throw new Error("Faqat note egasi hamkor qo‘shishi mumkin");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new Error(
      "Bu email bilan foydalanuvchi topilmadi. Avval ro‘yxatdan o‘tkazing!",
    );

  // Alla qachon hamkor bo‘lsa tekshirish
  const existing = await prisma.collaboration.findUnique({
    where: {
      noteId_userId: {
        noteId: id,
        userId: user.id,
      },
    },
  });

  if (existing) throw new Error("Bu foydalanuvchi allaqachon hamkor");

  return prisma.collaboration.create({
    data: {
      noteId: id,
      userId: user.id,
      role: "EDITOR",
    },
    include: { user: { select: { username: true, email: true } } },
  });
};

export const updateNoteTitle = async (noteId, userId, newTitle) => {
  const id = Number(noteId);

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) throw new Error("Note topilmadi");

  const isOwner = note.ownerId === userId;
  const isCollaborator = await prisma.collaboration.findFirst({
    where: { noteId: id, userId, role: { in: ["OWNER", "EDITOR"] } },
  });

  if (!isOwner && !isCollaborator) {
    throw new Error("Bu noteni o‘zgartirish huquqingiz yo‘q");
  }

  return prisma.note.update({
    where: { id },
    data: { title: newTitle },
    include: { owner: true, collaborators: { include: { user: true } } },
  });
};

export const createComment = async (noteId, userId, content) => {
  const id = Number(noteId);
  if (!content?.trim()) throw new Error("Comment bo‘sh bo‘lishi mumkin emas");

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new Error("Note topilmadi");

  const isOwner = note.ownerId === userId;
  const isCollaborator = await prisma.collaboration.findFirst({
    where: { noteId: id, userId, role: { in: ["OWNER", "EDITOR", "VIEWER"] } },
  });

  if (!isOwner && !isCollaborator)
    throw new Error("Comment qo‘shish huquqingiz yo‘q");

  return prisma.comment.create({
    data: { noteId: id, userId, content },
    include: { user: { select: { id: true, username: true } } },
  });
};

export const getComments = async (noteId, userId) => {
  const id = Number(noteId);

  const hasAccess = await prisma.note.findFirst({
    where: {
      id,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
  });
  if (!hasAccess) throw new Error("Note ga kirish huquqi yo‘q");

  return prisma.comment.findMany({
    where: { noteId: id },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "asc" },
  });
};

export default {
  createNote,
  getMyNotes,
  getNoteById,
  deleteNote,
  addCollaborator,
  updateNoteTitle,
  createComment,
  getComments,
};
