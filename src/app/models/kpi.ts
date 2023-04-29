import {formatNumber} from '@angular/common';

export class KPI {
    title: string;
    value: string;
    text!: string;
    cssClass!: string;

    constructor(title: string, value: number, cssClass: string, text?: string) {
        this.title = title;
        this.value = this.parseValue(value, text);
        this.cssClass = cssClass;
    }

    private parseValue(value: number, text?: string) {
        const ftValue = formatNumber(value, 'es-MX', '1.0-3');
        console.log(ftValue);

        return text
            ? `$${ftValue}/${text}`
            : `$${ftValue}`
    }
}