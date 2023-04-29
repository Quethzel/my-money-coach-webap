import { NgModule } from '@angular/core';
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
import { ChartComponent } from './components/chart/chart.component';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeMX);

@NgModule({
  declarations: [
    AppComponent,
    ExpensesDashboardComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    KpiComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
