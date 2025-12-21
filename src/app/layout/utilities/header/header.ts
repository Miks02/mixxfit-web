import { Component, inject } from '@angular/core';
import { LayoutState } from '../../services/layout-state';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    title: string = ""
    subtitle: string = "Welcome back! Ready for the next workout ?"

    layoutState = inject(LayoutState);
    browserTitle = inject(Title)

    ngOnInit() {
        this.layoutState.getTitle().subscribe(res => {
            this.title = res
            this.browserTitle.setTitle("VitalOps | " + this.title);
        })
    }


}
