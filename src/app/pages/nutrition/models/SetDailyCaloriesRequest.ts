import { Gender } from "../../../core/models/Gender";
import { ActivityLevel } from "./ActivityLevel";

export type SetDailyCaloriesRequest = {
  age: number,
  gender: Gender,
  height: number,
  weight: number,
  activityLevel: ActivityLevel
}
