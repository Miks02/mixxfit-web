import { afterNextRender, Component, computed, ElementRef, input, viewChildren } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-dashboard-card',
  host: {
    class: 'contents',
  },
  imports: [NgIcon],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
    title = input.required<string>();
    icon = input.required<string>();
    value = input<string | null | undefined>(null);
    unavailableText = input<string>('No data yet...');
    cardClass = input<string>('bg-slate-600');
    valueClass = input<string>('text-xl font-semibold overflow-hidden whitespace-nowrap');
    unavailableClass = input<string>('text-xl font-semibold overflow-hidden whitespace-nowrap typewriter');
    unavailableIcon = input<string>('faSolidGhost');

    readonly baseClass = 'flex flex-col pl-5 justify-between rounded-2xl w-full lg:w-65 grow h-45 px-2 py-4 text-gray-100 font-semibold shadow-xl hover:shadow-white/50 transition-shadow duration-200';

    typewriterElements = viewChildren<ElementRef>('typewriter');

    constructor() {
        afterNextRender(() => {
            this.typewriterElements().forEach((el: ElementRef) => {
                el.nativeElement.style.setProperty('--target-width', el.nativeElement.scrollWidth + 'px');
            });
        });
    }

    mergedClass = computed(() => `${this.baseClass} ${this.cardClass()}`.trim());

    isUnavailable = computed(() => {
        const value = this.value();
        return value === null || value === undefined || value === '';
    });


}
