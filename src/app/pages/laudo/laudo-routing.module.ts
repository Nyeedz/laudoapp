import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaudoComponent } from './laudo.component';

const routes: Routes = [{ path: '', component: LaudoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReportsRoutingModule {}
