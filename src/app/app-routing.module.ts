import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesDashboardComponent } from './expenses-dashboard/expenses-dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AnnualExpensesComponent } from './components/annual-expenses/annual-expenses.component';
import { VariableExpensesComponent } from './variable-expenses/variable-expenses.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: 'register', component: RegisterComponent, pathMatch: "full" },
  { path: 'forgot-pass', component: ForgotPassComponent, pathMatch: "full" },
  { path: 'dashboard', component: ExpensesDashboardComponent, pathMatch: "full" },
  { path: 'home', redirectTo: '/dashboard', pathMatch: "full" },
  { path: 'expenses', component: ExpensesComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'variable-expenses/:year', component: VariableExpensesComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'variable-expenses/:year/:month', component: VariableExpensesComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'annual-expenses', component: AnnualExpensesComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: '', redirectTo: '/expenses', pathMatch: "full" },
  { path: '**', component: ExpensesDashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
