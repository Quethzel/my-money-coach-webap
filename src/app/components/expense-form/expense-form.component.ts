import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  expense!: IExpenses;

  myForm?: UntypedFormGroup;
  
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private expService: ExpensesService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.expenseForm = this.formBuilder.group({
      city: ['', Validators.required],
      cityCode: [''],
      item: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      cost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      date: ['', Validators.required]
    });

    this.myForm = this.fb.group({
      date: null,
      range: null
    });

    // this.expenseForm.controls['city'].setValue("MTY");
  }

  chageCity($event: Event) {
    this.expenseForm.patchValue({
      cityCode: ($event.target as HTMLInputElement).value
    });
  }

  onSubmit(): void {
    this.expense = this.expenseForm.getRawValue();
    
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


}
