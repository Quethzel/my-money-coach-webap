import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStoppedEvent, CellValueChangedEvent, ColDef, ColumnApi, GetRowIdFunc, GetRowIdParams, GridApi, GridOptions, GridReadyEvent, RowClassRules, ValueFormatterParams } from 'ag-grid-community';
import { AnnualExpense } from 'src/app/models/annual-expense';
import { CellRendererDateComponent } from '../cell-renderer-date/cell-renderer-date.component';

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
  newAnnualExpense: AnnualExpense;
  pinnedTopRowData: any[] = [];
  pinnedBottomRowData: any[] = [];

  columnDefs: ColDef[] = [
    { field: 'item', headerName: 'Item', width: 300 },
    { field: 'category', headerName: 'Category', width: 100, maxWidth: 150 },
    { field: 'subcategory', headerName: 'Subcategory', width: 120, maxWidth: 180 },
    { 
      field: 'paymentDate', headerName: 'Date', minWidth:100, width: 100, maxWidth: 130, 
      cellEditor: 'agDateCellEditor',
      cellEditorParams: {
        max: new Date(new Date().getFullYear(), 11, 31)
      },
      cellRendererSelector: (params: any) => {
        if (!params.node.rowPinned) {
          return { component: CellRendererDateComponent }
        } else { return undefined }
      }
    },
    {
      field: 'cost', headerName: 'Cost', filter: 'agNumberColumnFilter', width: 70, maxWidth: 120,
      valueFormatter: (params: any) => {
        const options = { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 };
        const currencyString = Intl.NumberFormat('es-MX', options);
        return currencyString.format(params.value);
      }
    },
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

  constructor() {
    this.context = { componentParent: this }
    this.expenses = [];

    this.newAnnualExpense = new AnnualExpense();
    this.pinnedTopRowData = [this.newAnnualExpense];
    
    this.clearUIFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.gridApi) {
      this.gridColumnApi.applyColumnState({
        state: [{ colId: 'paymentDate', sort: 'asc' }],
        defaultState: { sort: null },
      });
      console.log('ngOnChanges');
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

  onFirstDataRendered(params: any) {
    this.generateDataForPinnedRowBottom();
  }

  onRowDataUpdated(params: any) {
    if (this.gridApi) {
      this.generateDataForPinnedRowBottom();
    }
  }

  onCellValueChanged(params: CellValueChangedEvent) {
    const isRowPinned = params.node.isRowPinned();
    const valueChange = params.oldValue != params.newValue;

    if (valueChange && !isRowPinned) {
      const item = params.node.data as AnnualExpense;
      this.save(item);
    }
  }

  onCellEditingStopped(params: CellEditingStoppedEvent) {
    // save new item
    if (this.isValidItem(this.newAnnualExpense)) {
      this.expenses = [...this.expenses, this.newAnnualExpense];
      this.save(this.newAnnualExpense);

      //reset pinned row
      this.newAnnualExpense = new AnnualExpense();
      this.pinnedTopRowData = [this.newAnnualExpense];
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
  }

  save(item: AnnualExpense) {
    this.saveItem.emit(item);
  }

  delete(item: AnnualExpense) {
    this.deleteItem.emit(item);
  }

  clearUIFilters() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
      this.gridApi.setPinnedBottomRowData([]);
    }
  }

  private isValidItem(item: Partial<AnnualExpense>) {
    return item.item && item.category && item.cost && item.paymentDate;
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
      // pinnedBottomRow['lineNo'] = totalLines;
      this.gridApi.setPinnedBottomRowData([pinnedBottomRow]);
    }
  }

  private generateDataForPinnedRowBottom() {
    let totalCost = 0;
    let totalLines = 0;
    this.gridApi.forEachNode((node) => {
      totalLines += 1;
      totalCost += node.data.cost 
    });
    this.setPinnedRowBottom(totalLines, totalCost);
  }

}
