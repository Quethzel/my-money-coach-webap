import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesDashboardComponent } from './expenses-dashboard/expenses-dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { AuthGuard } from './auth.guard';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: 'register', component: RegisterComponent, pathMatch: "full" },
  { path: 'forgot-pass', component: ForgotPassComponent, pathMatch: "full" },
  { path: 'home', component: ExpensesDashboardComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpenseFormComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: '', component: ExpensesDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', component: ExpensesDashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
