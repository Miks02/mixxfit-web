import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDetailsDto } from '../models/user-details-dto';
import { UserState } from '../states/user-state';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private api = environment.apiUrl;
    private urlOnly = environment.urlOnly;

    private http = inject(HttpClient);
    private userState = inject(UserState);

    getMe() {

        if(this.userState.isUserLoaded()) {
            const userDetails = this.userState.userDetails() as UserDetailsDto;
            return of(userDetails);
        }

        return this.http.get<UserDetailsDto>(`${this.api}/users/me`).pipe(
            tap((res) => {
                this.userState.setUserDetails(res);
                if(res.imagePath !== null) {
                    let image = this.urlOnly + res.imagePath;
                    this.userState.updateUserDetails({ imagePath: image });
                }
            })
        )
    }

}
