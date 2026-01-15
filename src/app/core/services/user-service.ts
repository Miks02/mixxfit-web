import { inject, Injectable } from '@angular/core';
import { BehaviorSubject,  tap } from 'rxjs';
import { UserDetailsDto } from '../models/UserDetailsDto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { UpdateFullNameDto } from '../models/User/UpdateFullNameDto';
import { ApiResponse } from '../models/ApiResponse';
import { UpdateWeightDto } from '../models/User/UpdateWeightDto';
import { UpdateUserNameDto } from '../models/User/UpdateUserNameDto';
import { UpdateEmailDto } from '../models/User/UpdateEmailDto';
import { UpdateDateOfBirthDto } from '../models/User/UpdateDateOfBirthDto';
import { UpdateGenderDto } from '../models/User/UpdateGenderDto';
import { UpdateHeightDto } from '../models/User/UpdateHeightDto';
import { Gender } from '../models/Gender';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private api = environment.apiUrl;
    private userDetailsSubject = new BehaviorSubject<UserDetailsDto | undefined>(undefined);
    public userDetails$ = this.userDetailsSubject.asObservable();

    private http = inject(HttpClient);

    set userDetails(userDetails: UserDetailsDto) {
        this.userDetailsSubject.next(userDetails);
    }

    private mergeUserDetails<T extends Partial<UserDetailsDto>>(patch: T): UserDetailsDto {
        const current = this.userDetailsSubject.getValue() ?? {} as UserDetailsDto;
        const next = { ...current, ...patch } as UserDetailsDto;
        return next;
    }

    updateFullName(fullName: UpdateFullNameDto) {
        return this.http.patch<ApiResponse<UpdateFullNameDto>>(`${this.api}/user/fullname`, fullName )
            .pipe(
                tap((res) => {
                    const next = this.mergeUserDetails({fullName: res.data.firstName + ' ' + res.data.lastName});
                    this.userDetailsSubject.next(next)
                }),
                tap((res) => { console.log(res) })
            )
    }

    updateWeight(weight: UpdateWeightDto) {
        return this.http.patch<ApiResponse<number>>(`${this.api}/user/weight`, weight)
            .pipe(
                tap((res) => {
                    const next = this.mergeUserDetails({weight: res.data});
                    this.userDetailsSubject.next(next)
                }),
            )
    }

    updateUserName(username: UpdateUserNameDto) {
        return this.http.patch<ApiResponse<string>>(`${this.api}/user/username`, username)
            .pipe(
                tap(res => {
                    const next = this.mergeUserDetails({ userName: res.data });
                    this.userDetailsSubject.next(next);
                }),
                tap(res => { console.log(res); })
            );
    }

    updateEmail(email: UpdateEmailDto) {
        return this.http.patch<ApiResponse<string>>(`${this.api}/user/email`, email)
            .pipe(
                tap(res => {
                    const next = this.mergeUserDetails({ email: res.data });
                    this.userDetailsSubject.next(next);
                }),
                tap(res => { console.log(res); })
            );
    }

    updateDateOfBirth(dob: UpdateDateOfBirthDto) {
        return this.http.patch<ApiResponse<string>>(`${this.api}/user/date-of-birth`, dob)
            .pipe(
                tap(res => {
                    const next = this.mergeUserDetails({ dateOfBirth: res.data });
                    this.userDetailsSubject.next(next);
                }),
                tap(res => { console.log(res); })
            );
    }

    updateGender(gender: UpdateGenderDto) {
        return this.http.patch<ApiResponse<Gender>>(`${this.api}/user/gender`, gender)
            .pipe(
                tap(res => {
                    const next = this.mergeUserDetails({ gender: res.data });
                    this.userDetailsSubject.next(next);
                }),
                tap(res => { console.log(res); })
            );
    }

    updateHeight(height: UpdateHeightDto) {
        return this.http.patch<ApiResponse<number>>(`${this.api}/user/height`, height)
            .pipe(
                tap(res => {
                    const next = this.mergeUserDetails({ height: res.data });
                    this.userDetailsSubject.next(next);
                }),
                tap(res => { console.log(res); })
            );
    }



}
