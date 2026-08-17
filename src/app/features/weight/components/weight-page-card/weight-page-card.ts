import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBullseye, faSolidScaleUnbalanced, faSolidWeightScale } from '@ng-icons/font-awesome/solid';
import { Button } from '@shared';

type IconName = 'faSolidBullseye' | 'faSolidWeightScale' | 'faSolidScaleUnbalanced';
type MainColor = "violet" | "red" | "emerald"

@Component({
    selector: 'app-weight-page-card',
    imports: [NgIcon, Button],
    providers: [
        provideIcons({
            faSolidWeightScale,
            faSolidBullseye,
            faSolidScaleUnbalanced
        }),
    ],
    templateUrl: './weight-page-card.html',
    styleUrl: './weight-page-card.css',
})
export class WeightPageCard {
    icon = input.required<IconName>();
    isLoading = input.required<boolean>();
    title = input.required<string>();
    subtitle = input.required<string>();
    value = input.required<string>();
    metadata = input<string>();
    bottomContentLeft = input.required<string>();
    bottomContentRight = input.required<string>();
    buttonText = input<string>();
    mainColor = input.required<MainColor>();
    clicked = output<void>();
    hasButton = input<boolean>(false);

    onClick = () => this.clicked.emit();

    private iconWrapperColorMap: Record<MainColor, string> = {
        violet: 'bg-violet-100',
        red: 'bg-red-100',
        emerald: 'bg-emerald-100',
    };

    private iconColorMap: Record<MainColor, string> = {
        violet: 'text-violet-700!',
        red: 'text-red-700!',
        emerald: 'text-emerald-700!',
    };

    iconWrapperColor = computed(() => this.iconWrapperColorMap[this.mainColor()]);
    iconColor = computed(() => this.iconColorMap[this.mainColor()]);
}
