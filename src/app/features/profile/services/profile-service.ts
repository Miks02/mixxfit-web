import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Gender } from '../../../core/models/Gender';
import { UpdateDateOfBirthDto } from '../../../core/models/User/UpdateDateOfBirthDto';
import { UpdateGenderDto } from '../../../core/models/User/UpdateGenderDto';
import { UpdateHeightDto } from '../../../core/models/User/UpdateHeightDto';
import { UpdateTargetWeightDto } from '../../../core/models/User/UpdateTargetWeightDto';
import { UserState } from '../../../core/states/user-state';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);
    private userState = inject(UserState);

    updateDateOfBirth(dob: UpdateDateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/fitness-profile/date-of-birth`, dob)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({dateOfBirth: res});
            })
        );
    }

    updateGender(gender: UpdateGenderDto) {
        return this.http.patch<Gender>(`${this.api}/fitness-profile/gender`, gender)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({gender: res});
            })
        );
    }

    updateHeight(height: UpdateHeightDto) {
        return this.http.patch<number>(`${this.api}/fitness-profile/height`, height)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({height: res});
            })
        );
    }
}
