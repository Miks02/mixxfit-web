import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {faSolidEnvelope, faSolidLock, faSolidUser, faSolidUserTag} from '@ng-icons/font-awesome/solid';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { RegisterRequest } from '../../core/models/RegisterRequest';

@Component({
    selector: 'app-register',
    imports: [NgIcon, RouterLink, ReactiveFormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css',
    providers: [provideIcons({faSolidUser, faSolidLock, faSolidEnvelope, faSolidUserTag})]
})
export class Register {

    private fb = inject(FormBuilder)
    private authService = inject(AuthService)
    private router = inject(Router)

    form = this.fb.group({
        firstName: ['', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20)
        ]],
        lastName: ['', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20)
        ]],
        email: ['', [
            Validators.required,
            Validators.email
        ]],
        userName: ['', [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20)
        ]],
        password: ['', [
            Validators.required,
            Validators.minLength(6)
        ]],
        confirmPassword: ['', [
            Validators.required,
               ]]

        }, {
            validators: [this.passwordMatchValidator]
        })

        get firstName () {return this.form.get('firstName');}
        get lastName() {return this.form.get('lastName')}
        get userName() {return this.form.get('userName')}
        get email() {return this.form.get('email')}
        get password() {return this.form.get('password')}
        get confirmPassword() {return this.form.get('confirmPassword')}

        private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
            const password = control.get('password');
            const confirmPassword = control.get('confirmPassword');

            if (!password || !confirmPassword) {
                return null;
            }

            return password.value === confirmPassword.value ? null : { passwordMismatch: true };
        }

        onSubmit() {
            if(this.form.invalid) {
                this.form.markAllAsTouched();
                return;
            }

            this.authService.register(this.form.value as RegisterRequest).subscribe({
                next: res => {
                    console.log("Registration successful! Response: \n")
                    this.router.navigate(['/dashboard']);
                },
                error: err => {
                    console.error("Error happened during the registration process. Details: \n" + err.message)
                }
            })

        }

    }
