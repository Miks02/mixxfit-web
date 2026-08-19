import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidCheck,
    faSolidCircleCheck,
    faSolidCircleExclamation,
    faSolidCircleInfo,
    faSolidCircleQuestion,
    faSolidTriangleExclamation,
    faSolidXmark,
} from '@ng-icons/font-awesome/solid';
import { Button } from '../button/button';
import { ModalData } from '../models/modal-data';
import { ModalType } from '../models/modal-type';

@Component({
    selector: 'app-modal',
    imports: [NgIcon, Button],
    templateUrl: './modal.html',
    styleUrl: './modal.css',
    providers: [
        provideIcons({
            faSolidXmark,
            faSolidCircleQuestion,
            faSolidCircleExclamation,
            faSolidCircleCheck,
            faSolidCircleInfo,
            faSolidTriangleExclamation,
        }),
    ],
})
export class Modal {
    @Input()
    data: ModalData | null = null;
    isLoading = input<boolean>(false);

    @Output()
    primaryAction = new EventEmitter<void>();
    @Output()
    secondaryAction = new EventEmitter<void>();
    @Output()
    close = new EventEmitter<void>();

    modalType = this.data?.type as ModalType;

    ngOnInit() {
        console.log(this.modalType);
    }

    onPrimaryClick() {
        this.primaryAction.emit();
    }

    onSecondaryClick() {
        this.secondaryAction.emit();
    }

    onClose() {
        this.close.emit();
    }
}
