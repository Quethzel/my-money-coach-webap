import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getRemainingDaysInCurrentMonth() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    return daysInMonth - today.getDate();;
  }

  getMonthName(month: number) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November'];

      return monthNames[month];
  }

  /**
   * Validate if a value is null or undefined
   * @param value any value
   * @returns true if the value is empty otherwise false
   */
  isEmpty(value: any) {
    return value == null || value == undefined;
  }

}
