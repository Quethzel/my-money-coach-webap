//TODO: This component is not used. Remove it
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IUserCity } from 'src/app/models/interfaces/ICity';

@Component({
  selector: 'app-city-cell-editor',
  templateUrl: './city-cell-editor.component.html',
  styleUrls: ['./city-cell-editor.component.scss']
})
export class CityCellEditorComponent implements ICellEditorAngularComp, AfterViewInit { 
  @ViewChild('input', { read: ViewContainerRef }) public input: any;

  cities!: any;
  value!: string;
  defaultCity!: IUserCity;

  agInit(params: any): void {
    this.cities = params.cities;
    this.defaultCity = params.defaultCity;
    this.value = params.value ? params.value : params.defaultCity;
  }

  isPopup(): boolean {
    return true;
  }

  getValue() {
    return this.value;
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.input.nativeElement.focus();
    })
  }

}
