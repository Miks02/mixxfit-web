import { WeightRecord } from "./weight-record"

export type WeightChart = {
    entries: WeightRecord[]
    targetWeight: number | null
}
