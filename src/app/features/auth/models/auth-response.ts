import { UserDetailsDto } from "../../../core/models/UserDetailsDto"

export type AuthResponse = {
    accessToken: string,
    user: UserDetailsDto
}
