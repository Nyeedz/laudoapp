import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent]
})
export class SharedModule {}
