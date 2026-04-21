import { UserDetailsDto } from "../../../core/models/user-details-dto"

export type AuthResponse = {
    accessToken: string,
    user: UserDetailsDto
}
