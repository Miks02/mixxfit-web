import { Component, inject, Output } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { Router, RouterOutlet } from "@angular/router";
import { BottomNav } from "../utilities/bottom-nav/bottom-nav";
import { AuthService } from '../../core/services/auth-service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-app-layout',
    imports: [Sidebar, Header, RouterOutlet, BottomNav],
    templateUrl: './app-layout.html',
    styleUrl: './app-layout.css',


})
export class AppLayout {

    authService = inject(AuthService)
    router = inject(Router)

    private destroy$ = new Subject<void>();

    isSidebarOpen: boolean = false;
    userFirstName: string = "";
    userLastName: string = "";

    ngOnInit() {
        this.authService.user$.pipe(
            tap(res => {
                this.userFirstName = res?.firstName as string;
                this.userLastName = res?.lastName as string;
            })
        )
        .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    openSidebar() {
        this.isSidebarOpen = true;
    }

    logout() {
        this.authService.logout()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

}
