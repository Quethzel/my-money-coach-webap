import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStoppedEvent, CellValueChangedEvent, ColDef, ColumnApi, GetRowIdFunc, GetRowIdParams, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AnnualExpense } from 'src/app/models/annual-expense';

@Component({
  selector: 'app-annual-expenses-grid',
  templateUrl: './annual-expenses-grid.component.html',
  styleUrls: ['./annual-expenses-grid.component.scss']
})
export class AnnualExpensesGridComponent {
  @Input() expenses: AnnualExpense[];
  @Output() saveItem = new EventEmitter<AnnualExpense>();
  @Output() deleteItem = new EventEmitter<AnnualExpense>();

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  
  context!: any;
  newVariableExpense:  AnnualExpense;
  pinnedTopRowData: any[] = [];
  pinnedBottomRowData: any[] = [];

  gridOptions: GridOptions = {
    suppressMenuHide: true,
    rowSelection: "single"
  };

  columnDefs: ColDef[] = [
    { field: 'item', headerName: 'Item' },
    { field: 'category', headerName: 'Category' },
    { field: 'subcategory', headerName: 'Subcategory' },
    { field: 'paymentDate', headerName: 'Payment Date' },
    { field: 'cost', headerName: 'Cost' },
  ];

    defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    sortable: true,
    resizable: true,
    filter: true
  };

    getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  constructor() {
    this.context = { componentParent: this }
    this.expenses = [];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
    this.gridApi.setFocusedCell(0, 'item', 'top');
  }

  private autoSizeAll(skipHeader: boolean = false) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onCellValueChanged(params: CellValueChangedEvent) { }

  onCellEditingStopped(params: CellEditingStoppedEvent) { }

}
