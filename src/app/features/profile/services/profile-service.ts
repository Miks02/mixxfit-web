import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Gender } from '../../../core/models/gender';
import { ProblemDetails } from '../../../core/models/problem-details';
import { UserState } from '../../../core/states/user-state';
import { DateOfBirthDto } from '../models/date-of-birth-dto';
import { EmailDto } from '../models/email-dto';
import { FullNameDto } from '../models/full-name-dto';
import { GenderDto } from '../models/gender-dto';
import { HeightDto } from '../models/height-dto';
import { PasswordDto } from '../models/password-dto';
import { UserNameDto } from '../models/username-dto';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = environment.apiUrl;
    private urlOnly = environment.urlOnly;

    private http = inject(HttpClient);
    private userState = inject(UserState);

    deleteAccountMutation = injectMutation<void, ProblemDetails, void>(() => ({
        mutationFn: async () => await lastValueFrom(this.deleteAccount()),
    }));

    deleteProfilePictureMutation = injectMutation<void, ProblemDetails, void>(() => ({
        mutationFn: async () => await lastValueFrom(this.deleteProfilePicture()),
        onSuccess: () => {
            this.userState.updateUserDetails({imagePath: null});
        }
    }));

    changePasswordMutation = injectMutation<void, ProblemDetails, PasswordDto>(() => ({
        mutationFn: async (model: PasswordDto) => await lastValueFrom(this.changePassword(model)),
    }));

    updateFullNameMutation = injectMutation<FullNameDto, ProblemDetails, FullNameDto>(() => ({
        mutationFn: async (fullName: FullNameDto) => await lastValueFrom(this.updateFullName(fullName)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({fullName: res.firstName + ' ' + res.lastName});
        }
    }));

    updateUserNameMutation = injectMutation<UserNameDto, ProblemDetails, UserNameDto>(() => ({
        mutationFn: async (username: UserNameDto) => await lastValueFrom(this.updateUserName(username)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({userName: res.userName});
        }
    }));

    updateEmailMutation = injectMutation<EmailDto, ProblemDetails, EmailDto>(() => ({
        mutationFn: async (email: EmailDto) => await lastValueFrom(this.updateEmail(email)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({email: res.email});
        }
    }));

    updateProfilePictureMutation = injectMutation<string, ProblemDetails, File>(() => ({
        mutationFn: async (imageFile: File) => await lastValueFrom(this.updateProfilePicture(imageFile)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({imagePath: this.urlOnly + res});
        }
    }));

    updateDateOfBirthMutation = injectMutation<string, ProblemDetails, DateOfBirthDto>(() => ({
        mutationFn: async (dob: DateOfBirthDto) => await lastValueFrom(this.updateDateOfBirth(dob)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({dateOfBirth: res});
        }
    }));

    updateGenderMutation = injectMutation<Gender, ProblemDetails, GenderDto>(() => ({
        mutationFn: async (gender: GenderDto) => await lastValueFrom(this.updateGender(gender)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({gender: res});
        }
    }));

    updateHeightMutation = injectMutation<number, ProblemDetails, HeightDto>(() => ({
        mutationFn: async (height: HeightDto) => await lastValueFrom(this.updateHeight(height)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({height: res});
        }
    }));

    private deleteAccount() {
        return this.http.delete<void>(`${this.api}/users`)
    }

    private deleteProfilePicture() {
        return this.http.delete<void>(`${this.api}/users/profile-picture`)
    }

    private changePassword(model: PasswordDto){
        return this.http.post<void>(`${this.api}/auth/password`, model)
    }

    private updateFullName(fullName: FullNameDto) {
        return this.http.patch<FullNameDto>(`${this.api}/users/fullname`, fullName)
    }

    private updateUserName(username: UserNameDto) {
        return this.http.patch<UserNameDto>(`${this.api}/users/username`, username)
    }

    private updateEmail(email: EmailDto) {
        return this.http.patch<EmailDto>(`${this.api}/users/email`, email)
    }

    private updateProfilePicture(imageFile: File) {
        const formData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);

        return this.http.patch(`${this.api}/users/profile-picture`, formData, {responseType: 'text'})
    }

    private updateDateOfBirth(dob: DateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/fitness-profile/date-of-birth`, dob)
    }

    private updateGender(gender: GenderDto) {
        return this.http.patch<Gender>(`${this.api}/fitness-profile/gender`, gender)
    }

    private updateHeight(height: HeightDto) {
        return this.http.patch<number>(`${this.api}/fitness-profile/height`, height)
    }
}
