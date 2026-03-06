import { WeightRecord } from "./weight-record"

export type WeightChartDto = {
    entries: WeightRecord[]
    targetWeight: number | null
}
