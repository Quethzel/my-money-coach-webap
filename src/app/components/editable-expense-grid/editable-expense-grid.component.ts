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
import { IUserCity } from 'src/app/models/interfaces/ICity';
import { VariableExpense } from 'src/app/models/variable-expense';

@Component({
  selector: 'app-editable-expense-grid',
  templateUrl: './editable-expense-grid.component.html',
  styleUrls: ['./editable-expense-grid.component.scss']
})
export class EditableExpenseGridComponent {
  @Input() expenses: VariableExpense[];
  @Output() saveItem = new EventEmitter<VariableExpense>();
  @Output() deleteItem = new EventEmitter<VariableExpense>();
  
  //TODO: cities should be comes from user cities
  cities: IUserCity[] = [
    { code: 'MTY', name: 'Monterrey', default: true },
    { code: 'CDMX', name: 'CDMX', default: false },
    { code: 'XAL', name: 'Xalapa', default: false },
    { code: 'OAX', name: 'Oaxaca', default: false },
  ];

  public columnDefs: ColDef[] = [
    { field: 'lineNo', headerName: '#', editable: false, maxWidth: 50, suppressMenu: true, sortable: false },
    { field: 'actions', headerName: 'Actions', cellRenderer: GridExpenseBtnsRendererComponent, maxWidth: 85, suppressMenu: true, sortable: false },
    { field: 'cityCode', headerName: 'City', minWidth: 80, maxWidth: 80,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: this.getCityCodes() }
    },
    { field: 'item', headerName: 'Item', width: 300 },
    { field: 'category', headerName: 'Category', width: 100, maxWidth: 150 },
    { field: 'subcategory', headerName: 'Subcategory', width: 120, maxWidth: 180 },
    { field: 'cost', headerName: 'Cost', filter: 'agNumberColumnFilter', width: 70, maxWidth: 120, 
      valueFormatter: (params: any) => {
        const options = { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 };
        const currencyString = Intl.NumberFormat('es-MX', options);
        return currencyString.format(params.value);
      }
    },
    { field: 'date', headerName: 'Date', width: 100, maxWidth: 130, 
      cellEditor: 'agDateCellEditor',
      cellEditorParams: {
        max: new Date()
      },
      cellRenderer: (data: any) => { 
        const opt: Intl.DateTimeFormatOptions = { year: "2-digit", month: "short", day: "2-digit" };
        const dt = data.value ? new Date(data.value) : new Date();
        const dateString = new Intl.DateTimeFormat('es-MX', opt).format(dt);
        return dateString;
      }
    },
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
  newVariableExpense:  VariableExpense;
  pinnedTopRowData: any[] = [];

  constructor() {
    this.context = { componentParent: this }
    this.expenses = [];

    this.newVariableExpense = new VariableExpense(this.getDefaultCity());
    this.pinnedTopRowData = [this.newVariableExpense];

    this.filters = new ExpenseFilters();
    this.filters.byThisMonth();
  }

  getDefaultCity() {
    let city = this.cities.find(c => c.default == true);
    if (!city) city = this.cities[0];
    return city;
  }

  getCityCodes() {
    return this.cities.map(c => c.code);
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

  save(item: VariableExpense) {
    this.saveItem.emit(item);
  }

  delete(rowId: any, item: VariableExpense) {
    this.gridApi.applyTransaction({ remove: [rowId] });
    this.deleteItem.emit(item);
  }

  onCellValueChanged(params: CellValueChangedEvent) {
    const isRowPinned = params.node.isRowPinned();
    const valueChange = params.oldValue != params.newValue;

    if (valueChange && !isRowPinned) {
      const item = params.node.data as VariableExpense;
      this.save(item);
    }

  }

  onCellEditingStopped(params: CellEditingStoppedEvent) {
    // save new item
    if (this.isValidItem(this.newVariableExpense)) {
      this.expenses = [...this.expenses, this.newVariableExpense];
      this.save(this.newVariableExpense);
      
      //reset pinned row
      this.newVariableExpense = new VariableExpense(this.getDefaultCity());
      this.pinnedTopRowData = [this.newVariableExpense];
    }
  }

  private isValidItem(item: Partial<VariableExpense>) {
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
