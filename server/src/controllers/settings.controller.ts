import { catchAsync } from "../utils/catchAsync.js";
import {
  getSettings as fetchSettings,
  updateSettings as saveSettings,
} from "../services/settings.service.js";

export const get = catchAsync(async (req: any, res: any, next: any) => {
  const settings = await fetchSettings();
  return res.json(settings ?? {});
});

export const update = catchAsync(async (req: any, res: any, next: any) => {
  const {
    currentYear,
    festivalTheme,
    festivalDates,
    trailerUrl,
    heroImageUrl,
    aboutText,
    rulesText,
  } = req.body;
  const settings = await saveSettings({
    currentYear,
    festivalTheme,
    festivalDates,
    trailerUrl,
    heroImageUrl,
    aboutText,
    rulesText,
  });
  return res.json(settings);
});
