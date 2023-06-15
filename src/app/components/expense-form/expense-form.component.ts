import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUserCity } from 'src/app/models/interfaces/ICity';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expense!: IExpenses;
  expenseForm!: FormGroup;
  cities: IUserCity[] = [];
  cityCode = '---';
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private expService: ExpensesService,
    ) {
      
      this.maxDate = new Date();

    }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      city: new FormControl(),
      // city: this.fb.group({
      //   code: [''],
      //   name: [''],
      //   default: [false]
      // }),
      item: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      cost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      date: [new Date(), Validators.required]
    });

    this.cities = [
      { code: 'MTY', name: 'Monterrey', default: true },
      { code: 'CDMX', name: 'CDMX', default: false },
      { code: 'XAL', name: 'Xalapa', default: false },
      { code: 'OAX', name: 'Oaxaca', default: false },
    ];

    this.setDefaultCity();
  }

  onChangeCity($event: any) {
    const cc = $event.target.selectedOptions[0]?.dataset?.value;
    this.cityCode = cc ? cc : '---';
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

  setDefaultCity() {
    const defaultCity = this.cities.find(c => c.default == true);
    if (defaultCity) {
      this.expenseForm.controls['city'].setValue(defaultCity, {onlySelf: true});
      this.cityCode = defaultCity.code;
    } else {
      this.expenseForm.controls['city'].setValue(this.cities[0]);
      this.cityCode = this.cities[0].code;
    }
  }

  onSubmit(): void {
    this.expense = this.mapToExpense(this.expenseForm.getRawValue());
  
    this.expService.saveExpense(this.expense).subscribe({
      next: (expense) => {
        this.bsModalRef.hide();
      },
      error: (e) => {
        alert(e.error?.message);
        console.error(e);
      }
    });
  }

  private mapToExpense(data: any) {
    return {
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
