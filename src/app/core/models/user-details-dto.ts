import { AccountStatus } from "./account-status"
import { Gender } from "./gender"

export type UserDetailsDto = {
    fullName: string,
    userName: string,
    email: string,
    imagePath: string | null,

    gender: Gender | null,
    currentWeight: number | null,
    targetWeight: number | null,
    height: number | null,
    dailyCalorieGoal: number | null,

    accountStatus: AccountStatus,
    dateOfBirth: string | null,
    age: number | null,

    registeredAt: string
}
