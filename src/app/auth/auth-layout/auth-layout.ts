import { Component } from '@angular/core';
import { Login } from "../login/login";

@Component({
  selector: 'app-auth-layout',
  imports: [Login],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

}
