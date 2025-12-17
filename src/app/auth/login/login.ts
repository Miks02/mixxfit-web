import { Component, signal, inject } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {faSolidLock, faSolidCheck, faSolidEnvelope} from '@ng-icons/font-awesome/solid';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators, FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    NgIcon,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [provideIcons({faSolidEnvelope, faSolidLock, faSolidCheck})]
})
export class Login {
    errorMessage = signal('')

    private fb = inject(FormBuilder);

    form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    onSubmit() {
        console.log("Form submitted");
    }

}
