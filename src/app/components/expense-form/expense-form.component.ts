import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IUserCity } from 'src/app/models/interfaces/ICity';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit, AfterViewInit {
  @ViewChild('item') itemField!: ElementRef;

  params: Object;
  expenseId!: string;
  expense!: IExpenses;
  expenseForm!: FormGroup;
  cities: IUserCity[] = [];
  cityCode = '---';
  maxDate: Date;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private expService: ExpensesService,
    private userService: UserService,
  ) {
    this.maxDate = new Date();
    this.params = (this.modalService.config.initialState) as Object;
    this.cities = this.userService.cties;
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      city: new FormControl(),
      item: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      cost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      date: [new Date(), Validators.required]
    });

    if (Object.keys(this.params).length > 0) {
      this.fillWithParams(this.params as IExpenses);
    } else {
      this.setDefaultCity();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.itemField?.nativeElement?.focus();
    }, 500);
  }

  onChangeCity($event: any) {
    const cc = $event.target.selectedOptions[0]?.dataset?.value;
    this.cityCode = cc ? cc : '---';
  }

  fillWithParams(expense: IExpenses) {
    this.expenseId = expense.id;
    this.expenseForm.setValue({
      item: expense.item,
      city: expense.city,
      category: expense.category,
      subcategory: expense.subcategory,
      cost: expense.cost,
      date: expense.date
    });

    const city = this.cities.find(c => c.code == expense.cityCode);
    if (city) {
      this.expenseForm.controls['city'].setValue(city, { onlySelf: true });
      this.cityCode = city.code;
    } else {
      this.setDefaultCity();
      alert(`City ${expense.city} no longer exists. Default city set`);
    }
  }

  setDefaultCity() {
    const defaultCity = this.cities.find(c => c.default == true);
    if (defaultCity) {
      this.expenseForm.controls['city'].setValue(defaultCity, { onlySelf: true });
      this.cityCode = defaultCity.code;
    } else {
      this.expenseForm.controls['city'].setValue(this.cities[0]);
      this.cityCode = this.cities[0].code;
    }
  }

  setPreviousDate() {
    let prevDate = new Date();
    const selectedDate = this.expenseForm.controls['date'].value;

    if (selectedDate instanceof Date) {
      prevDate.setDate(selectedDate.getDate() - 1);
      this.expenseForm.controls['date'].setValue(prevDate);
    } else {
      alert('Selected Date is invalid!');
    }
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.expense = this.mapToExpense(this.expenseForm.getRawValue());
      
      this.expService.saveExpense(this.expense).subscribe({
        next: (expense) => {
          this.bsModalRef.hide();
        },
        error: (e) => {
          alert(e.error?.error?.message);
          console.error(e);
        }
      });
    }
  }

  private mapToExpense(data: any) {
    return {
      id: this.expenseId ? this.expenseId : null,
      city: data.city.name,
      cityCode: data.city.code,
      item: data.item,
      category: data.category,
      subcategory: data.subcategory,
      cost: data.cost,
      date: data.date
    } as IExpenses;
  }


}
