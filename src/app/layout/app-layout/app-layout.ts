import { Component, computed, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, Subject, takeUntil } from 'rxjs';
import { Gender } from '../../core/models/gender';
import { AuthService } from '../../core/services/auth-service';
import { UserService } from '../../core/services/user-service';
import { UserState } from '../../core/states/user-state';
import { BottomNav } from "../utilities/bottom-nav/bottom-nav";
import { Header } from '../utilities/header/header';
import { Sidebar } from '../utilities/sidebar/sidebar';

@Component({
    selector: 'app-app-layout',
    imports: [Sidebar, Header, RouterOutlet, BottomNav],
    templateUrl: './app-layout.html',
    styleUrl: './app-layout.css',
})
export class AppLayout {
    @ViewChild('content') content!: ElementRef<HTMLDivElement>

    authService = inject(AuthService);
    userService = inject(UserService);
    userState = inject(UserState);
    router = inject(Router);

    private destroy$ = new Subject<void>();

    isSidebarOpen: boolean = false;
    fullName: Signal<string> = computed(() => this.userState.userDetails()?.fullName ?? "");
    userImage: Signal<string> = computed(() => this.userState.userDetails()?.imagePath ?? "")
    userGender: Signal<Gender> = computed(() => this.userState.userDetails()?.gender ?? Gender.Other)

    ngOnInit() {
        this.loadUser();
    }

    ngAfterViewInit() {
        this.router.events
        .pipe(
            filter(e => e instanceof NavigationEnd && !e.url.includes('?')),
            takeUntil(this.destroy$)
        )
        .subscribe(() => this.content.nativeElement.scrollTo({top: 0}))
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
        .subscribe(() => this.router.navigate(['/login']));
    }

    private loadUser() {
        return this.userService.getMe()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

}
