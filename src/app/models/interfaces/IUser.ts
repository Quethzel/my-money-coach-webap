export interface IUserSettings {
    monthlyExpenseBudget?: number;
}

export interface IUser {
    email: string;
    name: string;
    lastName: string;
    settings: IUserSettings;
}