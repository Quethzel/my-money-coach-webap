import { Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ColumnApi, GridReadyEvent, 
  CellValueChangedEvent, 
  CellEditingStoppedEvent,
  ValueFormatterParams,
  RowClassRules,
  GridOptions,
} from 'ag-grid-community';
import { ExpenseFilters } from 'src/app/models/ExpenseFilters';
import { GridExpenseBtnsRendererComponent } from '../grid-expense-btns-renderer/grid-expense-btns-renderer.component';
import { VariableExpense } from 'src/app/models/variable-expense';
import { UserService } from 'src/app/services/user.service';
import { VariableExpensesEventhubService } from 'src/app/services/variable-expenses-eventhub.service';
import { Subscription } from 'rxjs';
import { CellRendererDateComponent } from '../cell-renderer-date/cell-renderer-date.component';

@Component({
  selector: 'app-editable-expense-grid',
  templateUrl: './editable-expense-grid.component.html',
  styleUrls: ['./editable-expense-grid.component.scss']
})
export class EditableExpenseGridComponent implements OnDestroy {
  @Input() expenses: VariableExpense[];
  @Output() saveItem = new EventEmitter<VariableExpense>();
  @Output() deleteItem = new EventEmitter<VariableExpense>();

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  private filters: ExpenseFilters;
  private sbEventHub: Subscription;

  context!: any;
  newVariableExpense:  VariableExpense;
  pinnedTopRowData: any[] = [];
  pinnedBottomRowData: any[] = [];

  columnDefs: ColDef[] = [
    { field: 'lineNo', headerName: '#', editable: false, minWidth: 60, maxWidth: 75, suppressMenu: true, sortable: false, resizable: true },
    { field: 'cityCode', headerName: 'City', minWidth: 80, maxWidth: 80,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: this.userService.getCityCodes() }
    },
    { 
      field: 'date', headerName: 'Date', minWidth:100, width: 100, maxWidth: 130, 
      cellEditor: 'agDateCellEditor',
      cellEditorParams: {
        max: new Date()
      },
      cellRendererSelector: (params: any) => {
        if (!params.node.rowPinned) {
          return { component: CellRendererDateComponent }
        } else { return undefined }
      }
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
    { field: 'actions', headerName: 'Actions', cellRenderer: GridExpenseBtnsRendererComponent, maxWidth: 85, suppressMenu: true, sortable: false, editable: false },
  ];

  defaultColDef: ColDef = {
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

  gridOptions: GridOptions = {
    suppressMenuHide: true,
    rowSelection: "single"
  };

  rowClassRules: RowClassRules = {
    'pinned-row-top': (params) => { return params.node.rowPinned == 'top' },
    'pinned-row-bottom': (params) => { return params.node.rowPinned == 'bottom' }
  };

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  constructor(private userService: UserService, private veEventHub: VariableExpensesEventhubService) {
    this.context = { componentParent: this }
    this.expenses = [];

    this.newVariableExpense = new VariableExpense(this.userService.getDefaultCity());
    this.pinnedTopRowData = [this.newVariableExpense];

    this.filters = new ExpenseFilters();
    this.filters.byThisMonth();

    this.sbEventHub = this.veEventHub.$gridHasUIFilters.subscribe(value => {
      if (!value) { this.clearUIFilters() }
    });

  }

  ngOnDestroy(): void {
    if (this.sbEventHub) this.sbEventHub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.gridApi) {
      this.gridColumnApi.applyColumnState({
        state: [{ colId: 'date', sort: 'desc' }],
        defaultState: { sort: null },
      });
      console.log('test');
      this.gridApi.refreshCells();
    }
  }

  autoSizeAll(skipHeader: boolean = false) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
    this.gridApi.setFocusedCell(0, 'item', 'top');
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
      this.newVariableExpense = new VariableExpense(this.userService.getDefaultCity());
      this.pinnedTopRowData = [this.newVariableExpense];
      this.gridApi.setFocusedCell(0, 'item', 'top');
    }
  }

  onFilterChanged($event: any) {
    let totalCost = 0;
    let totalLines = 0;
    $event.api.forEachNodeAfterFilter((node: any) => { 
      totalLines += 1;
      totalCost += node.data.cost 
    });
    this.setPinnedRowBottom(totalLines, totalCost);

    const hasUIFilter = Object.keys($event.api.getFilterModel()).length > 0;
    this.veEventHub.setGridHasUIFilters(hasUIFilter);
  }

  save(item: VariableExpense) {
    this.saveItem.emit(item);
  }

  delete(rowId: any, item: VariableExpense) {
    this.deleteItem.emit(item);
  }

  clearUIFilters() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
      this.gridApi.setPinnedBottomRowData([]);
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

  private setPinnedRowBottom(totalLines: number, totalCost: number) {
    if (this.gridApi) {
      const pinnedBottomRow: any = {};
      this.gridColumnApi.getAllGridColumns().forEach(item => { 
        const id = item.getColId();
        pinnedBottomRow[id] = null ;
      });
      
      pinnedBottomRow['cost'] = totalCost;
      pinnedBottomRow['lineNo'] = totalLines;
      this.gridApi.setPinnedBottomRowData([pinnedBottomRow]);
    }
  }


}
