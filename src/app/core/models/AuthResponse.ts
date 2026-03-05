import { UserDetailsDto } from "./UserDetailsDto"

export type AuthResponse = {
    accessToken: string,
    user: UserDetailsDto
}
