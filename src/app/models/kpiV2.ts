import { CommonService } from "../services/common.service";

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
            this.value = CommonService.formatAsCurrency(Number(value));
        } else {
            this.value = value.toString();
        }
    }

}