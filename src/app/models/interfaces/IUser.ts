import { IUserCity } from "./ICity";

export interface IUserSettings {
    monthlyExpenseBudget?: number;
    // defaultCity?: IUserCity
}

export interface IUser {
    email: string;
    name: string;
    lastName: string;
    settings: IUserSettings;
}