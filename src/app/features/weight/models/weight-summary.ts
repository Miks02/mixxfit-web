import { WeightChartDto } from "./weight-chart"
import { WeightListDetails} from "./weight-list-details"
import { WeightRecord } from "./weight-record"

export type WeightSummary = {
    firstEntry: WeightRecord,
    currentWeight: WeightRecord,
    progress: number,
    years: number[],
    weightListDetails: WeightListDetails,
    weightChart: WeightChartDto
}
