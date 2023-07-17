import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ColumnApi, GridReadyEvent, RowNodeTransaction, CellValueChangedEvent, AgGridEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { ExpenseFilters } from 'src/app/models/ExpenseFilters';
import { GridExpenseBtnsRendererComponent } from '../grid-expense-btns-renderer/grid-expense-btns-renderer.component';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { RowNumberCellRendererComponent } from '../row-number-cell-renderer/row-number-cell-renderer.component';

@Component({
  selector: 'app-editable-expense-grid',
  templateUrl: './editable-expense-grid.component.html',
  styleUrls: ['./editable-expense-grid.component.scss']
})
export class EditableExpenseGridComponent {
  @Input() expenses: IExpenses[];
  @Output() editItem = new EventEmitter<IExpenses>();
  @Output() deleteItem = new EventEmitter<IExpenses>();
  
  public columnDefs: ColDef[] = [
    { field: 'rowNo', headerName: '#',  cellRenderer: RowNumberCellRendererComponent, editable: false },
    { field: 'actions', headerName: 'Actions', cellRenderer: GridExpenseBtnsRendererComponent },
    { field: 'cityCode', headerName: 'City' },
    { field: 'item', headerName: 'Item' },
    { field: 'category', headerName: 'Category' },
    { field: 'subcategory', headerName: 'Subcategory' },
    { field: 'cost', headerName: 'Cost', filter: 'agNumberColumnFilter' },
    { field: 'date', headerName: 'Date' },
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    sortable: true,
    resizable: true,
    filter: true,
  };

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  private filters: ExpenseFilters;
  
  public rowData$!: Observable<any[]>;

  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  context!: any;

  constructor() {
    this.context = {
      componentParent: this
    }

    this.expenses = [];

    this.filters = new ExpenseFilters();
    this.filters.byThisMonth();



  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (this.gridApi) {
      this.gridApi.setDomLayout('autoHeight');
      this.gridColumnApi.applyColumnState({
        state: [{ colId: 'date', sort: 'desc' }],
        defaultState: { sort: null },
      });
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  edit(item: IExpenses) {
    this.editItem.emit(item);
  }

  delete(rowId: any, item: IExpenses) {
    // const selectedData = this.gridApi.getSelectedRows();
    // this.gridApi.applyTransaction({ remove: selectedData });
    this.gridApi.applyTransaction({ remove: [rowId] });
    this.deleteItem.emit(item);
  }

  onCellValueChanged(params: CellValueChangedEvent) {
    var changedData = [params.data];
    console.log(changedData);
  }

}
