import { WeightChartDto } from "./WeightChartDto"
import { WeightEntryDetailsDto } from "./WeightEntryDetailsDto"
import { WeightListDetailsDto } from "./WeightListDetailsDto"
import { WeightRecordDto } from "./WeightRecordDto"

export type WeightSummaryDto = {
    firstEntry: WeightRecordDto,
    currentWeight: WeightRecordDto,
    progress: number,
    years: number[],
    weightListDetails: WeightListDetailsDto,
    weightChart: WeightChartDto
}
