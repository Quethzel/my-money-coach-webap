import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesDashboardComponent } from './expenses-dashboard/expenses-dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: 'register', component: RegisterComponent, pathMatch: "full" },
  { path: 'home', component: ExpensesDashboardComponent },
  { path: '', component: ExpensesDashboardComponent },
  { path: '**', component: ExpensesDashboardComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
