import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
import { UserDetailsDto } from '../models/UserDetailsDto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UpdateFullNameDto } from '../models/User/UpdateFullNameDto';
import { UpdateUserNameDto } from '../models/User/UpdateUserNameDto';
import { UpdateEmailDto } from '../models/User/UpdateEmailDto';
import { UpdateDateOfBirthDto } from '../models/User/UpdateDateOfBirthDto';
import { UpdateGenderDto } from '../models/User/UpdateGenderDto';
import { UpdateHeightDto } from '../models/User/UpdateHeightDto';
import { UpdateTargetWeightDto } from '../models/User/UpdateTargetWeightDto';
import { Gender } from '../models/Gender';
import { UserState } from '../states/user-state';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private api = environment.apiUrl;
    private urlOnly = environment.urlOnly;
    private userDetailsSubject = new BehaviorSubject<UserDetailsDto | null>(null);
    public userDetails$ = this.userDetailsSubject.asObservable();

    private http = inject(HttpClient);
    private userState = inject(UserState);

    set userDetails(userDetails: Partial<UserDetailsDto>) {
        const currentUser = this.userDetailsSubject.getValue() as UserDetailsDto
        this.userDetailsSubject.next({...currentUser,...userDetails});
    }

    get userDetails() {
        return this.userDetailsSubject.getValue() as UserDetailsDto;
    }

    resetCurrentUser() {
        this.userDetailsSubject.next(null);
    }

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

    updateFullName(fullName: UpdateFullNameDto) {
        return this.http.patch<UpdateFullNameDto>(`${this.api}/users/fullname`, fullName )
        .pipe(
            tap((res) => {
                this.userState.updateUserDetails({fullName: res.firstName + ' ' + res.lastName})
            })
        )
    }

    updateUserName(username: UpdateUserNameDto) {
        return this.http.patch(`${this.api}/users/username`, username, {responseType: 'text'})
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({userName: res});
            })
        );
    }

    updateEmail(email: UpdateEmailDto) {
        return this.http.patch(`${this.api}/users/email`, email, {responseType: 'text'})
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({email: res});
            })
        );
    }

    updateDateOfBirth(dob: UpdateDateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/users/date-of-birth`, dob)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({dateOfBirth: res});
            })
        );
    }

    updateGender(gender: UpdateGenderDto) {
        return this.http.patch<Gender>(`${this.api}/users/gender`, gender)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({gender: res});
            })
        );
    }

    updateHeight(height: UpdateHeightDto) {
        return this.http.patch<number>(`${this.api}/users/height`, height)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({height: res});
            })
        );
    }

    updateTargetWeight(targetWeight: UpdateTargetWeightDto) {
        return this.http.patch<number>(`${this.api}/users/target-weight`, targetWeight)
        .pipe(
            tap(res => {
                this.userState.updateUserDetails({targetWeight: res});
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

}
