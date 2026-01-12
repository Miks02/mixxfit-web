import { AccountStatus } from "./AccountStatus"
import { Gender } from "./Gender"

export type UserDetailsDto = {
    fullName: string,
    userName: string,
    email: string,
    imagePath: string,

    gender?: Gender,
    weight?: number,
    height?: number,

    accountStatus: AccountStatus,
    dateOfBirth?: string,
    age?: number,

    registeredAt: string
}
