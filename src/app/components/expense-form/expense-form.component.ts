import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  
  constructor(private formBuilder: FormBuilder, private expService: ExpensesService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.expenseForm = this.formBuilder.group({
      city: ['', Validators.required],
      cityCode: ['', Validators.required],
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


  }

  onSubmit(): void {
    console.log(this.expenseForm.value);

    this.expense = this.expenseForm.getRawValue();
    
    this.expService.saveExpense(this.expense);

  }
}
