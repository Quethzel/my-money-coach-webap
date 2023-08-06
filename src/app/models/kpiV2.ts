import { formatNumber } from "@angular/common";

export enum KPIType {
    Number = 1,
    Currency,
}

export class KPIv2 {
    title: string;
    value: string;
    legend?: string;

    constructor(title: string, value: string | number, kpiType: KPIType, legend?: string) {
        this.title = title;
        if (legend) {
            this.legend = legend;
        }
        
        if (kpiType == KPIType.Currency) {
            this.value = this.formatAsCurrency(Number(value));
        } else {
            this.value = value.toString();
        }
    }

    //TODO: replace by same method in common service
    private formatAsCurrency(value: number) {
        const ftValue = formatNumber(value, 'es-MX', '1.0-2');
        return `$${ftValue}`;
    }
}