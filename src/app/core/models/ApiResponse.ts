
export type ApiResponse<T> = {
    data: T,
    message: T
    errors: {
        code: string,
        description: string
    }
}
