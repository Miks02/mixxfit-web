import { Component, computed, input, output } from '@angular/core';

type ButtonType = "primary" | "secondary" | "danger" | "default"
type ButtonSize = "default" | "sm"
type FontSize = "default" | "lg" | "xl" | "sm" | "xs"
type HtmlButtonType = "button" | "submit" | "reset"

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
    buttonType = input<ButtonType>("default");
    buttonSize = input<ButtonSize>("default")
    htmlType = input<HtmlButtonType>("button");
    fontSize = input<FontSize>("default");
    isFullWidth = input<boolean>(false);
    isLoading = input<boolean>(false);
    disabled = input<boolean>(false);
    iconName = input<string>();
    label = input<string>();

    clicked = output<void>();

    onClick() {
        this.clicked.emit();
    }

    getColors = computed(() => {
        switch(this.buttonType()) {
            case "default":
                return "bg-linear-to-br from-yellow-400 to-yellow-500 text-slate-800"
            case "primary":
                return "bg-linear-to-br from-emerald-400 to-emerald-500 text-white"
            case "secondary":
                return "bg-linear-to-br from-amber-400 to-amber-500 text-slate-800"
            case "danger":
                return "bg-linear-to-br from-red-600 to-red-700  text-slate-100"
            default:
                 return "bg-linear-to-br from-yellow-400 to-yellow-500  text-slate-800"
        }
    })

    getSize = computed(() => this.buttonSize() == 'sm' ? 'py-2 px-4' : "py-4 px-6")

    getFontSize = computed(() => {
        switch(this.fontSize()) {
            case "default":
                return "";
            case "lg":
                return "text-lg";
            case "xl":
                return "text-xl";
            case "sm":
                return "text-sm";
            case "xs":
                return "text-xs"
        }
    })

}
