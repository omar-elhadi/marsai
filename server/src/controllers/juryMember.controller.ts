import { catchAsync } from "../utils/catchAsync.js";
import {
  getJuryMembers as fetchAll,
  getJuryMemberById as fetchById,
  createJuryMember as create,
  updateJuryMember as update,
  deleteJuryMember as remove,
} from "../services/juryMember.service.js";

export const list = catchAsync(async (req: any, res: any, next: any) => {
  const members = await fetchAll();
  return res.json(members);
});

export const getOne = catchAsync(async (req: any, res: any, next: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });
  const member = await fetchById(id);
  return res.json(member);
});

export const create = catchAsync(async (req: any, res: any, next: any) => {
  const {
    firstName,
    lastName,
    title,
    bio,
    photoUrl,
    displayOrder,
    website,
    instagram,
    twitter,
  } = req.body;
  if (!firstName || !lastName || !title || !bio) {
    return res
      .status(400)
      .json({ error: "firstName, lastName, title et bio sont requis" });
  }
  const member = await create({
    firstName,
    lastName,
    title,
    bio,
    photoUrl,
    displayOrder,
    website,
    instagram,
    twitter,
  });
  return res.status(201).json(member);
});

export const update = catchAsync(async (req: any, res: any, next: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });
  const {
    firstName,
    lastName,
    title,
    bio,
    photoUrl,
    displayOrder,
    website,
    instagram,
    twitter,
  } = req.body;
  const member = await update(id, {
    firstName,
    lastName,
    title,
    bio,
    photoUrl,
    displayOrder,
    website,
    instagram,
    twitter,
  });
  return res.json(member);
});

export const remove = catchAsync(async (req: any, res: any, next: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });
  const result = await remove(id);
  return res.json(result);
});
