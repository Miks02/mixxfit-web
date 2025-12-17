import { UserDto } from "./UserDto"

export type AuthResponse = {
    accessToken: string,
    user: UserDto
}
