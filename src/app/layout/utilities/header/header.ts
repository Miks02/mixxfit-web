import { Component, inject, Input } from '@angular/core';
import { LayoutState } from '../../services/layout-state';
import { Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header {
    @Input()
    userFirstName: string = "";
    @Input()
    userLastName: string = "";

    title: string = ""
    subtitle: string = "Welcome back! Ready for the next workout ?"
    userInitials: string = "";

    layoutState = inject(LayoutState);
    browserTitle = inject(Title)

    ngOnInit() {
        this.layoutState.getTitle().subscribe(res => {
            this.title = res
            this.browserTitle.setTitle("VitalOps | " + this.title);
        })

    }

    ngOnChanges() {
        this.userInitials = this.buildInitials(this.userFirstName, this.userLastName);
    }

    private buildInitials(firstName: string, lastName: string): string {
        const firstNameArr = firstName.split(' ');
        const lastNameArr = lastName.split(' ');

        const fName = firstNameArr[0].at(0) as string
        const lName = lastNameArr[0].at(0) as string;

        const initials = fName + lName;
        return initials.toUpperCase();
    }


}
