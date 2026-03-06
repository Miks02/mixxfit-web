import { WeightEntryDetails } from "../../../weight/models/weight-entry-details";

export type WeightChartDataDto = {
    entries: WeightEntryDetails[];
    targetWeight: number | null;
}
