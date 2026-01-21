import { Component, inject } from '@angular/core';
import { WeightChart } from "../../misc/weight-chart/weight-chart";
import { LayoutState } from '../../../layout/services/layout-state';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidBullseye, faSolidClock, faSolidMagnifyingGlassChart, faSolidNoteSticky, faSolidScaleUnbalanced, faSolidWeightScale } from '@ng-icons/font-awesome/solid';

@Component({
  selector: 'app-weight-page',
  imports: [WeightChart, NgIcon],
  templateUrl: './weight-page.html',
  styleUrl: './weight-page.css',
  providers: [provideIcons({faSolidScaleUnbalanced, faSolidBullseye, faSolidMagnifyingGlassChart, faSolidClock, faSolidWeightScale, faSolidNoteSticky})]
})
export class WeightPage {
    private layoutState = inject(LayoutState);


    ngOnInit() {
        this.layoutState.setTitle("Weight Tracking");
    }

}
