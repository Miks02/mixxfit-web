import { WeightRecordDto } from "./WeightRecordDto"

export type WeightChartDto = {
    entries: WeightRecordDto[]
    targetWeight: number | null
}
