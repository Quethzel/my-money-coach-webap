import { Component, Input, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { IAnnualCostPerCity } from 'src/app/models/interfaces/IAnnualCostPerCity';

@Component({
  selector: 'app-annual-cost-per-city-grid',
  templateUrl: './annual-cost-per-city-grid.component.html',
  styleUrls: ['./annual-cost-per-city-grid.component.scss']
})
export class AnnualCostPerCityGridComponent {
  @Input() data: IAnnualCostPerCity[];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  public gridContainerStyle: any = {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
  };

  private gridApi!: GridApi;

  context!: any;

  gridOptions: GridOptions = {
    suppressMenuHide: true,
    rowSelection: 'multiple',
  };

  columnDefs: ColDef[] = [
    { field: 'cityCode', headerName: 'City', maxWidth: 80 },
    { field: 'residenceTime', headerName: 'Residence Time (days)' },
    { field: 'costPerDay', headerName: 'Cost Per Day', valueFormatter: this.currencyFormatter, cellClass: 'align-right', sort: 'desc' },
    { field: 'total', headerName: 'Total', valueFormatter: this.currencyFormatter, cellClass: 'align-right', maxWidth: 120 },
  ];

  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
  };

  constructor() {
    this.context = { componentParent: this };
    this.data = [];
  }

  ngOnInit() {
    this.updateGridHeight();
  }

  ngOnChanges() {
    this.updateGridHeight();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  private currencyFormatter(params: any) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(params.value);
  }

  private updateGridHeight() {
    const rowCount = this.data.length;
    const rowHeight = 40;
    const maxHeight = 510; 

    if (rowCount * rowHeight > maxHeight) {
      this.fillMaxHeight();
      
    } else {
      this.fillAuto();
    }
  }

  private fillAuto() {
    this.setWidthAndHeight('100%', '100%');
  }

  private fillMaxHeight() {
    this.setWidthAndHeight('100%', '510px');
  }

  private setWidthAndHeight(width: string, height: string) {
    this.gridContainerStyle = {
      width: width,
      height: height,
    };
  }

}
