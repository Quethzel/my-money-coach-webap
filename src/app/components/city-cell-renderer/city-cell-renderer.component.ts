import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IUserCity } from 'src/app/models/interfaces/ICity';

@Component({
  selector: 'app-city-cell-renderer',
  template: '{{cityCode}}',
})
export class CityCellRendererComponent implements ICellRendererAngularComp {

  cityCode: string = '---';
  defaultCity!: IUserCity;

  agInit(params: any): void {
    this.defaultCity = params.defaultCity;
    
    if (params.value != null && params.value != '') {
      this.cityCode = params.value;
    } else if (this.defaultCity) {
      this.cityCode = this.defaultCity.code;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

}
