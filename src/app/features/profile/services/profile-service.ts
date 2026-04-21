import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Gender } from '../../../core/models/gender';
import { DateOfBirthDto } from '../models/date-of-birth-dto';
import { GenderDto } from '../models/gender-dto';
import { HeightDto } from '../models/height-dto';
import { UserState } from '../../../core/states/user-state';
import { FullNameDto } from '../models/full-name-dto';
import { EmailDto } from '../models/email-dto';
import { UserNameDto } from '../models/username-dto';
import { PasswordDto } from '../models/password-dto';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = environment.apiUrl;
    private urlOnly = environment.urlOnly;

    private http = inject(HttpClient);
    private userState = inject(UserState);

    deleteAccount() {
        return this.http.delete<void>(`${this.api}/users`)
    }

    deleteProfilePicture() {
        return this.http.delete<void>(`${this.api}/users/profile-picture`)
        .pipe(
            tap(() => {
                this.userState.updateUserDetails({imagePath: null});
            })
        )
    }

    changePassword(model: PasswordDto){
        return this.http.post<void>(`${this.api}/auth/password`, model)
    }

    updateFullName(fullName: FullNameDto) {
        return this.http.patch<FullNameDto>(`${this.api}/users/fullname`, fullName )
        .pipe(
            tap((res) => {
                this.userState.updateUserDetails({fullName: res.firstName + ' ' + res.lastName})
            })
        )
    }

    updateUserName(username: UserNameDto) {
        return this.http.patch<UserNameDto>(`${this.api}/users/username`, username,)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({userName: res.userName});
            })
        );
    }

    updateEmail(email: EmailDto) {
        return this.http.patch<EmailDto>(`${this.api}/users/email`, email,)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({email: res.email});
            })
        );

    }

    updateProfilePicture(imageFile: File) {
        const formData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);

        return this.http.patch(`${this.api}/users/profile-picture`, formData, {responseType: 'text'})
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({imagePath: this.urlOnly + res});
            })
        )
    }

    updateDateOfBirth(dob: DateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/fitness-profile/date-of-birth`, dob)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({dateOfBirth: res});
            })
        );
    }

    updateGender(gender: GenderDto) {
        return this.http.patch<Gender>(`${this.api}/fitness-profile/gender`, gender)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({gender: res});
            })
        );
    }

    updateHeight(height: HeightDto) {
        return this.http.patch<number>(`${this.api}/fitness-profile/height`, height)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({height: res});
            })
        );
    }
}
