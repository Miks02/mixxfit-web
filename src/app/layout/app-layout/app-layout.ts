import { Component } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-app-layout',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',


})
export class AppLayout {

}
