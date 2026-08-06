import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCheck, faSolidEnvelope, faSolidLock } from '@ng-icons/font-awesome/solid';
import { finalize, take } from 'rxjs';
import { LoginRequest } from '../../models/login-request';
import { AuthService } from '../../../../core/services/auth-service';
import { Button } from '@shared';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
    selector: 'app-login',
    imports: [
        NgIcon,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        MatProgressSpinnerModule,
        Button
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
    providers: [provideIcons({faSolidEnvelope, faSolidLock, faSolidCheck})]
})
export class Login {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService)
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    ngOnInit() {
        if (this.activatedRoute.snapshot.queryParamMap.get("expired") === 'true') {
            this.notificationService.showInfo('Your session has expired or is no longer valid. Please sign in again.');
        }
    }

    isLoading: WritableSignal<boolean> = signal(false);

    form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [false]
    });

    get email() {return this.form.get('email')}
    get password() {return this.form.get('password')}

    onSubmit() {
        if(this.form.invalid){
            this.form.markAllAsTouched();
            return;
        }
        this.isLoading.set(true);

        this.authService.login(this.form.value as LoginRequest)
        .pipe(take(1), finalize(() => this.isLoading.set(false)))
        .subscribe(() => this.router.navigate(['/dashboard']))
    }

}
