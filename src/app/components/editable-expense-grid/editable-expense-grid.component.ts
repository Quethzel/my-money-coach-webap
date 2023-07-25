import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ColumnApi, GridReadyEvent, 
  CellValueChangedEvent, 
  CellEditingStoppedEvent,
  ValueFormatterParams,
  RowClassRules,
} from 'ag-grid-community';
import { ExpenseFilters } from 'src/app/models/ExpenseFilters';
import { GridExpenseBtnsRendererComponent } from '../grid-expense-btns-renderer/grid-expense-btns-renderer.component';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { CityCellEditorComponent } from '../city-cell-editor/city-cell-editor.component';
import { CityCellRendererComponent } from '../city-cell-renderer/city-cell-renderer.component';
import { IUserCity } from 'src/app/models/interfaces/ICity';

@Component({
  selector: 'app-editable-expense-grid',
  templateUrl: './editable-expense-grid.component.html',
  styleUrls: ['./editable-expense-grid.component.scss']
})
export class EditableExpenseGridComponent {
  @Input() expenses: IExpenses[] | any[];
  @Output() saveItem = new EventEmitter<IExpenses>();
  @Output() deleteItem = new EventEmitter<IExpenses>();
  
  //TODO: cities should be comes from user cities
  cities: IUserCity[] = [
    { code: 'MTY', name: 'Monterrey', default: true },
    { code: 'CDMX', name: 'CDMX', default: false },
    { code: 'XAL', name: 'Xalapa', default: false },
    { code: 'OAX', name: 'Oaxaca', default: false },
  ];

  public columnDefs: ColDef[] = [
    { field: 'lineNo', headerName: '#', editable: false, maxWidth: 70 },
    { field: 'actions', headerName: 'Actions', cellRenderer: GridExpenseBtnsRendererComponent, maxWidth: 120 },
    { field: 'cityCode', headerName: 'City', minWidth: 80, maxWidth: 80,
      cellEditor: CityCellEditorComponent,
      cellEditorParams: () => {
        return { 
          defaultCity: this.getDefaultCity(),
          cities: this.cities 
        }
      },
      cellRenderer: CityCellRendererComponent,
      cellRendererParams: () => {
        return { defaultCity: this.getDefaultCity() }
      }
    },
    { field: 'item', headerName: 'Item', width: 220 },
    { field: 'category', headerName: 'Category', width: 100, maxWidth: 150 },
    { field: 'subcategory', headerName: 'Subcategory', width: 120, maxWidth: 180 },
    { field: 'cost', headerName: 'Cost', filter: 'agNumberColumnFilter', width: 80, maxWidth: 120 },
    { field: 'date', headerName: 'Date', width: 100, maxWidth: 130 },
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    sortable: true,
    resizable: true,
    filter: true,
    valueFormatter: (params: ValueFormatterParams): any =>
      this.isEmptyPinnedCell(params)
        ? this.createPinnedCellPlaceholder(params)
        : undefined,
  };

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  private filters: ExpenseFilters;
  
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  public rowClassRules: RowClassRules = {
    'pinned-row-top': (params) => { return params.node.rowPinned == 'top' }
  };

  context!: any;
  inputRow:  {[k: string]: any} = {};
  pinnedTopRowData: any[] = [];

  constructor() {
    this.context = {
      componentParent: this
    }

    this.expenses = [];

    // this.inputRow = this.newRow();
    this.pinnedTopRowData = [this.inputRow];


    this.filters = new ExpenseFilters();
    this.filters.byThisMonth();
  }

  getDefaultCity() {
    let city = this.cities.find(c => c.default == true);
    if (!city) city = this.cities[0];
    return city;
  }

  autoSizeAll(skipHeader: boolean = false) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.gridApi) {
      this.gridApi.setDomLayout('autoHeight');
      this.gridColumnApi.applyColumnState({
        state: [{ colId: 'date', sort: 'desc' }],
        defaultState: { sort: null },
      });

      this.gridApi.refreshCells();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
  }

  save(item: IExpenses) {
    this.saveItem.emit(item);
  }

  delete(rowId: any, item: IExpenses) {
    // const selectedData = this.gridApi.getSelectedRows();
    // this.gridApi.applyTransaction({ remove: selectedData });
    this.gridApi.applyTransaction({ remove: [rowId] });
    this.deleteItem.emit(item);
  }

  onCellValueChanged(params: CellValueChangedEvent) { }

  onCellEditingStopped(params: CellEditingStoppedEvent) {
    // save data
    if (this.isValidItem(this.inputRow)) {
      const defaultCity = this.getDefaultCity();
      const newExpense = this.inputRow as IExpenses;
      if (!newExpense.cityCode) {
        newExpense.city = defaultCity.name;
        newExpense.cityCode = defaultCity.code;
      } else {
        const city = this.cities.find(c => c.code == newExpense.cityCode);
        if (city) newExpense.city = city.name;
      }

      this.expenses = [...this.expenses, newExpense];

      this.save(newExpense);
      
      //reset pinned row
      this.inputRow = {};
      this.pinnedTopRowData = [this.inputRow];
    }
  }

  private isValidItem(item: Partial<IExpenses>) {
    return item.item && item.category && item.cost && item.date;
  }

  private isEmptyPinnedCell({ node, value }: ValueFormatterParams): boolean {
    return (
      (node?.rowPinned === 'top' && value == null) ||
      (node?.rowPinned === 'top' && value === '')
    );
  }

  private createPinnedCellPlaceholder({colDef,}: ValueFormatterParams) {
    if (colDef != undefined && colDef.field && colDef.headerName)
      if (colDef.field == 'item')
        return 'New Item...';
      else
        return colDef.headerName;
    else return '---';
  }

}
