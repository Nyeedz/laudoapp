import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AmbienteService } from '../../services/ambiente/ambiente.service';
import { ItemService } from '../../services/item/item.service';
import { LaudoService } from '../../services/laudo/laudo.service';
import { UtilsService } from '../../services/utils/utils.service';
import { VistoriaService } from '../../services/vistoria/vistoria.service';
import { Ambiente } from '../../shared/entities/ambiente';
import { Laudo } from '../../shared/entities/laudo';
import { AmbienteComponent } from '../ambiente/ambiente.component';
import { ItemAmbiente } from 'src/app/shared/entities/item-ambiente';

@Component({
  selector: 'app-laudo',
  templateUrl: './laudo.component.html',
  styleUrls: ['./laudo.component.scss']
})
export class LaudoComponent implements OnInit {
  visible = 'cadastrados';
  laudo: Laudo;
  ambientes: Ambiente[] = [];
  ambientesStorage: Ambiente[] = [];
  vistoriaId: string;

  constructor(
    public modalController: ModalController,
    private storage: Storage,
    private vistoriaService: VistoriaService,
    private ambienteService: AmbienteService,
    private itemService: ItemService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private laudoService: LaudoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const { id } = params;
      if (id) {
        this.vistoriaId = id;
        this.loadLaudo(id);
      }
    });
  }

  async saveLaudo() {
    console.log('salvando', this.vistoriaId)
  }

  async addAmbiente() {
    try {
      const modal = await this.modalController.create({
        component: AmbienteComponent,
        componentProps: {
          laudo: this.laudo
        }
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      console.log(data);
      this.loadAmbientes();
    } catch(err) {
      console.log(err)
    }
  }

  async editAmbiente(ambiente: Ambiente) {
    try {
      const modal = await this.modalController.create({
        component: AmbienteComponent,
        componentProps: {
          ambiente,
          laudo: this.laudo
        }
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      console.log(data);
      this.loadAmbientes();
    } catch (err) {
      console.log(err)
    }
  }

  async deleteAmbiente(ambiente: Ambiente) {
    try {
      const res = await this.ambienteService.delete(ambiente._id);
      console.log(res);
      this.loadAmbientes();
    } catch (err) {
      console.log(err)
    }
  }

  loadAmbientes(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const ambientes = await this.ambienteService.findByLaudo(this.laudo._id);
      this.ambientes = ambientes;
      resolve();
    });
  }

  loadAmbientesStorage(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const ambientesStorage = await this.ambienteService.findStorage(
        this.laudo._id
      );
      this.ambientesStorage = ambientesStorage;
      resolve();
    });
  }

  async loadLaudo(vistoriaId?: any): Promise<void> {
    try {
      const laudos = await this.laudoService.findOne(vistoriaId);
      this.laudo = laudos[0];
      await this.loadAmbientes();
      await this.loadAmbientesStorage();
    } catch (err) {
      console.log(err);
    }
  }

  async doRefresh(e): Promise<void> {
    if (this.visible == 'cadastrados') {
      await this.loadAmbientes();
      e.target.complete();
    } else {
      await this.loadAmbientesStorage();
      e.target.complete();
    }
  }
}
