import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesDashboardComponent } from './expenses-dashboard/expenses-dashboard.component';

const routes: Routes = [
  { path: 'home', component: ExpensesDashboardComponent },
  { path: '', component: ExpensesDashboardComponent },
  { path: '**', component: ExpensesDashboardComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
