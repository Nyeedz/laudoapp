import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ambiente } from '../../shared/entities/ambiente';
import { Laudo } from '../../shared/entities/laudo';
import { EnvironmentComponent } from '../environment/environment.component';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit {
  @Input() data: Laudo;
  ambientes: Ambiente[] = [];
  constructor(public modalController: ModalController) {}

  ngOnInit() {
    if (this.data) {
      this.ambientes = this.data.ambientes;
    }
  }

  async back(save: boolean) {
    if (this.ambientes.length == 0 && save) {
      return;
    }
    return await this.modalController.dismiss(save ? this.ambientes : null);
  }

  async environmentCreate() {
    const modal = await this.modalController.create({
      component: EnvironmentComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.ambientes.push(data);
    }
  }

  async removeEnvironment(index: number) {
    this.ambientes.splice(index, 1);
  }

  async editEnvironment(index: number) {
    const modal = await this.modalController.create({
      component: EnvironmentComponent,
      componentProps: {
        data: this.ambientes[index]
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.ambientes[index] = data;
    }
  }
}
