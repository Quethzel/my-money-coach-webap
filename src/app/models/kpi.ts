import {formatNumber} from '@angular/common';

export class KPI {
    title: string;
    value: string;
    text!: string;
    cssClass!: string;

    constructor(title: string, value: number, cssClass: string, text?: string) {
        this.title = title;
        this.cssClass = cssClass;
        this.value = this.formatValue(value, text);
        if (text) {
            this.text = text
        }
    }

    private formatValue(value: number, text?: string) {
        const ftValue = formatNumber(value, 'es-MX', '1.0-3');
        return text ? `$${ftValue}/` : `$${ftValue}`
    }
}
