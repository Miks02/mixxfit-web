import { ModalType } from "./modal-type";

export type ModalData = {
    title: string,
    subtitle?: string,
    type: ModalType,
    primaryActionLabel?: string,
    secondaryActionLabel?: string,
    primaryAction?: () => void,
    secondaryAction?: () => void
};
