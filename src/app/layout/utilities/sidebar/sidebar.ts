import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  faSolidUser,
  faSolidBookOpen,
  faSolidChartLine,
  faSolidGear,
  faSolidDumbbell,
  faSolidBowlRice,
  faSolidMoon,
  faSolidCircleChevronLeft,
  faSolidRightToBracket,
  faSolidScaleUnbalanced
} from "@ng-icons/font-awesome/solid";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: 'app-sidebar',
    imports: [NgIcon, RouterLink],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
    providers: [provideIcons({faSolidUser, faSolidChartLine, faSolidGear, faSolidBookOpen, faSolidDumbbell, faSolidBowlRice, faSolidScaleUnbalanced, faSolidMoon, faSolidCircleChevronLeft, faSolidRightToBracket})]
})
export class Sidebar {
    @Input()
    isOpen: boolean = false;

    @Output()
    close = new EventEmitter<void>();
    @Output()
    logout = new EventEmitter<void>();

    private router = inject(Router)

    onSidebarClose(route: string | null = null) {
        this.close.emit();
        if(!route)
            return;

        setTimeout(() => {
            this.router.navigate([route])
        }, 100);

    }

    onLogout() {
        this.logout.emit();
    }

}
