import { ModalType } from "./ModalType";

export type ModalData = {
    title: string,
    subtitle?: string,
    type: ModalType,
    primaryActionLabel?: string,
    secondaryActionLabel?: string,
    primaryAction?: () => void,
    secondaryAction?: () => void
};
