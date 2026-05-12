import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ModalLayoutConfig } from '../../exercise/models/modal-layout-config';

@Injectable({
    providedIn: 'root',
})
export class TemplateModalLayoutService {
    private readonly _config: WritableSignal<ModalLayoutConfig | undefined> = signal(undefined);
    config: Signal<ModalLayoutConfig | undefined> = this._config.asReadonly();

    setConfig(config: ModalLayoutConfig) {
        this._config.set(config);
    }
}
