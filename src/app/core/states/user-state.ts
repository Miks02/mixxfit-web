import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { UserDetailsDto } from '../models/user-details-dto';

@Injectable({
  providedIn: 'root',
})
export class UserState {
  private _userDetails: WritableSignal<UserDetailsDto | null> = signal(null);

  readonly userDetails: Signal<UserDetailsDto | null> = this._userDetails.asReadonly();

  setUserDetails(userDetails: UserDetailsDto) {
    this._userDetails.set(userDetails);
  }

  updateUserDetails(userDetails: Partial<UserDetailsDto>) {
    this._userDetails.update((current) => ({...current,...userDetails} as UserDetailsDto));
  }

  resetCurrentUser() {
    this._userDetails.set(null);
  }

  isUserLoaded() {
    return this._userDetails() !== null;
  }


}
