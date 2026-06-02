import { catchAsync } from "../utils/catchAsync.js";
import {
  subscribe as addSubscriber,
  unsubscribe as removeSubscriber,
} from "../services/newsletter.service.js";

export const subscribe = catchAsync(async (req: any, res: any, next: any) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }
  const subscriber = await addSubscriber(email.trim().toLowerCase());
  return res.status(201).json({ message: "Inscription réussie", subscriber });
});

export const unsubscribe = catchAsync(async (req: any, res: any, next: any) => {
  const { token } = req.params;
  const result = await removeSubscriber(token);
  return res.json(result);
});
