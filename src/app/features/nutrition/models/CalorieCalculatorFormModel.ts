import { ActivityLevel } from './ActivityLevel';
import { UnitSystem } from './UnitSystem';

export type CalorieCalculatorFormModel = {
    unitSystem: UnitSystem;
    age: number | null;
    gender: 'male' | 'female';
    weightKg: number | null;
    weightLbs: number | null;
    heightCm: number | null;
    heightFt: number | null;
    heightIn: number | null;
    activityLevel: ActivityLevel;
}
