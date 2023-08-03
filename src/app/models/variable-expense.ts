import { IUserCity } from "./interfaces/ICity";

export class VariableExpense {
    id: string | null;
    city: string | null;
    cityCode: string | null;
    item: string | null;
    category: string | null;
    subcategory: string | null;
    cost: number;
    date: Date;
    
    constructor(city?: IUserCity) {
        this.id = null;
        this.item = null;
        this.city = null;
        this.cityCode = null;
        this.category = null;
        this.subcategory = null;
        this.cost = 0;
        this.date = new Date();

        if (city) {
            this.city = city.name;
            this.cityCode = city.code;
        }
    }
}