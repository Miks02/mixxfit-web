import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ModalLayoutConfig } from '../models/modal-layout-config';

@Injectable({
    providedIn: 'root',
})
export class ExerciseModalLayoutService {
    private readonly _config: WritableSignal<ModalLayoutConfig | undefined> = signal(undefined);
    config: Signal<ModalLayoutConfig | undefined> = this._config.asReadonly();

    setConfig(config: ModalLayoutConfig) {
        this._config.set(config);
    }


}
