import { WeightEntryDetailsDto } from "./WeightEntryDetailsDto"
import { WeightRecordDto } from "./WeightRecordDto"

export type WeightListDetailsDto = {
    weightLogs: WeightRecordDto[],
    months: number[]
}
