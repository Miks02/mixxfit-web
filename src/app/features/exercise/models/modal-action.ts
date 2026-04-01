import { WritableSignal } from "@angular/core";

export type ModalAction = {
    icon: string,
    action: WritableSignal<boolean>;
}
