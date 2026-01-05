import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalData } from '../../../core/models/ModalData';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidCheck, faSolidCircleCheck, faSolidCircleExclamation, faSolidCircleInfo, faSolidCircleQuestion, faSolidTriangleExclamation, faSolidXmark } from '@ng-icons/font-awesome/solid';
import { ModalType } from '../../../core/models/ModalType';

@Component({
  selector: 'app-modal',
  imports: [NgIcon],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  providers: [provideIcons({faSolidXmark, faSolidCircleQuestion, faSolidCircleExclamation, faSolidCircleCheck, faSolidCircleInfo, faSolidTriangleExclamation})]
})
export class Modal {
    @Input()
    data: ModalData | null = null

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
