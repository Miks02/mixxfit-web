import { Component, computed, ElementRef, inject, Output, Signal, ViewChild } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { BottomNav } from "../utilities/bottom-nav/bottom-nav";
import { AuthService } from '../../core/services/auth-service';
import { filter, Subject, take, takeUntil, tap } from 'rxjs';
import { UserService } from '../../core/services/user-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Gender } from '../../core/models/Gender';

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
    router = inject(Router);

    private destroy$ = new Subject<void>();

    isSidebarOpen: boolean = false;
    userSource = toSignal(this.userService.userDetails$, {initialValue: null});
    fullName: Signal<string> = computed(() => this.userSource()?.fullName ?? "");
    userImage: Signal<string> = computed(() => this.userSource()?.imagePath ?? "")
    userGender: Signal<Gender> = computed(() => this.userSource()?.gender ?? Gender.Other)

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
