import { AccountStatus } from "./account-status"
import { Gender } from "./gender"

export type UserDetailsDto = {
    fullName: string,
    userName: string,
    email: string,
    imagePath: string | null,

    gender?: Gender,
    currentWeight?: number,
    targetWeight?: number,
    height?: number,
    dailyCalorieGoal?: number,

    accountStatus: AccountStatus,
    dateOfBirth?: string,
    age?: number,

    registeredAt: string
}
