import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { LaudoService } from '../../services/laudo/laudo.service';
import { VistoriaService } from '../../services/vistoria/vistoria.service';
import { NewReportComponent } from '../new-report/new-report.component';
import { Ambiente } from './../../shared/entities/ambiente';
import { Laudo } from './../../shared/entities/laudo';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  laudos: Laudo[];
  constructor(
    public modalController: ModalController,
    private storage: Storage,
    private vistoriaService: VistoriaService,
    private route: ActivatedRoute,
    private laudoService: LaudoService
  ) {}

  async newReport() {
    const modal = await this.modalController.create({
      component: NewReportComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.saveToStorage(data);
    }
  }

  async editReport(index: number) {
    const modal = await this.modalController.create({
      component: NewReportComponent,
      componentProps: {
        data: this.laudos[index]
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log(data);
    }
  }

  async saveToStorage(data: Ambiente[]) {
    const laudos = (await this.storage.get('laudos')) || [];

    laudos.push({
      ambientes: data,
      data: moment().format('DD/MM/YYYY HH:mm'),
      saved: false
    });

    this.storage.set('laudos', laudos);
    this.loadLaudos();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.loadLaudos(id);
      }
    });
  }

  async loadLaudos(vistoriaId?: any) {
    const laudosStorage = await this.storage.get('laudos');
    const laudos = await this.laudoService.findOne(vistoriaId);
    console.log(laudos)
    console.log(laudosStorage)
    this.laudos = laudos;
  }
}
