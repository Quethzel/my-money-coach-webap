import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IUserCity } from 'src/app/models/interfaces/ICity';

@Component({
  selector: 'app-city-cell-editor',
  templateUrl: './city-cell-editor.component.html',
  styleUrls: ['./city-cell-editor.component.scss']
})
export class CityCellEditorComponent implements ICellEditorAngularComp { 

  cities!: any;
  value!: string;
  defaultCity!: IUserCity;

  agInit(params: any): void {
    this.cities = params.cities;
    this.defaultCity = params.defaultCity;
    this.value = params.value ? params.value : params.defaultCity;
  }

  getValue() {
    return this.value;
  }

}
