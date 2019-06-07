import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { EnvironmentItemComponent } from '../environment-item/environment-item.component';
import { EnvironmentComponent } from '../environment/environment.component';
import { NewReportComponent } from '../new-report/new-report.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  imports: [
    IonicModule,
    ReportsRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ReportsComponent,
    NewReportComponent,
    EnvironmentComponent,
    EnvironmentItemComponent
  ],
  declarations: [
    ReportsComponent,
    NewReportComponent,
    EnvironmentComponent,
    EnvironmentItemComponent
  ]
})
export class ReportsModule {}
