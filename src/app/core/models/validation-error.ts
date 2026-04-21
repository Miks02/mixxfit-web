export type ValidationError = {
    errors: { [key: string]: string[]},
    status: number,
    title: string
}
