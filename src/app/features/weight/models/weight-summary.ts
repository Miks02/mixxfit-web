import { WeightChart } from "./weight-chart"
import { WeightDelta } from "./weight-delta";
import { WeightListDetails} from "./weight-list-details"
import { WeightRecord } from "./weight-record"

export type WeightSummary = {
    currentWeight: WeightRecord | null,
    years: number[],
    weightListDetails: WeightListDetails,
    weightChart: WeightChart,
    weightDelta: WeightDelta | null,
    yearsAndMonthsGroup: Record<number, number[]>
}
