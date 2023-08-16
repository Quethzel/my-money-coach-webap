import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpensesDashboardComponent } from './expenses-dashboard/expenses-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { FooterComponent } from './home/footer/footer.component';
import { HeaderComponent } from './home/header/header.component';
import { NgChartsModule } from 'ng2-charts';
import { KpiComponent } from './components/kpi/kpi.component';
import localeMX from '@angular/common/locales/es-MX';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptorService } from './authInterceptor';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditableExpenseGridComponent } from './components/editable-expense-grid/editable-expense-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridExpenseBtnsRendererComponent } from './components/grid-expense-btns-renderer/grid-expense-btns-renderer.component';
import { KpiV2Component } from './components/kpi-v2/kpi-v2.component';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(localeMX);

@NgModule({
  declarations: [
    AppComponent,
    ExpensesDashboardComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    KpiComponent,
    ExpenseFormComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPassComponent,
    ExpensesListComponent,
    ExpensesComponent,
    UserProfileComponent,
    EditableExpenseGridComponent,
    GridExpenseBtnsRendererComponent,
    KpiV2Component,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    FontAwesomeModule,
    AgGridModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(librabry: FaIconLibrary) {
    librabry.addIcons(faTrash, faPenToSquare);
  }
}
