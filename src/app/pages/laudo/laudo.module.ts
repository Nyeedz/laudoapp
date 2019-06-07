import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { AmbienteComponent } from '../ambiente/ambiente.component';
import { EnvironmentItemComponent } from '../environment-item/environment-item.component';
import { EnvironmentComponent } from '../environment/environment.component';
import { NewReportComponent } from '../new-report/new-report.component';
import { ReportsRoutingModule } from './laudo-routing.module';
import { LaudoComponent } from './laudo.component';
import { ItemComponent } from '../item/item.component';

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
    LaudoComponent,
    NewReportComponent,
    AmbienteComponent,
    ItemComponent,
    EnvironmentComponent,
    EnvironmentItemComponent
  ],
  declarations: [
    LaudoComponent,
    NewReportComponent,
    AmbienteComponent,
    ItemComponent,
    EnvironmentComponent,
    EnvironmentItemComponent
  ]
})
export class LaudoModule {}
