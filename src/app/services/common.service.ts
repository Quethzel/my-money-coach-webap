import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  static formatAsCurrency(value: number) {
    const ftValue = formatNumber(value, 'es-MX', '1.0-2');
    return `$${ftValue}`;
  }

  getRemainingDaysInCurrentMonth() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    return daysInMonth - today.getDate();
  }

  getRemaningDaysInCurrentYear() {
    const today = new Date();
    const lastDateOfTheYear = new Date(today.getFullYear(), 11, 31);
    const diff = Math.abs(today.getTime() - lastDateOfTheYear.getTime());

    return Math.ceil(diff/(1000*3600*24));
  }

  /**
   * Get the name of the month
  */
  getMonthName(month: number) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];

      return monthNames[month];
  }

  /**
   * Get days of the week
   */
  getDaysOfTheWeek() {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }

  /**
   * Validate if a value is null or undefined
   * @param value any value
   * @returns true if the value is empty otherwise false
   */
  isEmpty(value: any) {
    return value == null || value == undefined;
  }


  /** 
   * Capitalize the first letter of a string
   */
  capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
