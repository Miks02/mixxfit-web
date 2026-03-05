import { Gender } from "../../../core/models/Gender";
import { ActivityLevel } from "./activity-level";

export type SetDailyCaloriesRequest = {
  age: number,
  gender: Gender,
  height: number,
  weight: number,
  activityLevel: ActivityLevel
}
