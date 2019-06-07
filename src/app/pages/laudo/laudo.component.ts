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

  loadAmbientes() {
    return new Promise(async (resolve, reject) => {
      const ambientes = await this.ambienteService.findByLaudo(this.laudo._id);
      this.ambientes = ambientes;
      resolve();
    });
  }

  loadAmbientesStorage() {
    return new Promise(async (resolve, reject) => {
      const ambientesStorage = await this.ambienteService.findStorage(
        this.laudo._id
      );
      this.ambientesStorage = ambientesStorage;
      resolve();
    });
  }

  async loadLaudo(vistoriaId?: any) {
    try {
      const laudos = await this.laudoService.findOne(vistoriaId);
      this.laudo = laudos[0];
      await this.loadAmbientes();
      await this.loadAmbientesStorage();
    } catch (err) {
      console.log(err);
    }
  }

  async doRefresh(e) {
    if (this.visible == 'cadastrados') {
      await this.loadAmbientes();
      e.target.complete();
    } else {
      await this.loadAmbientesStorage();
      e.target.complete();
    }
  }

  async edit(ambiente: Ambiente) {
    const modal = await this.modalController.create({
      component: AmbienteComponent,
      componentProps: {
        data: ambiente
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data);

    if (data) {
      if (typeof data.fotoFachada != 'object') {
        const fotoFachada = await this.utilsService.dataURItoFile(
          data.fotoFachada
        );
        await this.uploadFotoFachada(ambiente._id, fotoFachada);
      }

      const ambienteRes = await this.ambienteService.update(
        {
          nome: data.nome
        },
        ambiente._id
      );
    }

    this.loadAmbientes();
  }

  async add() {
    try {
      const modal = await this.modalController.create({
        component: AmbienteComponent
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      console.log(data);

      const fotoFachada = await this.utilsService.dataURItoFile(
        data.fotoFachada
      );
      const ambiente = await this.ambienteService.create({
        nome: data.nome,
        laudo: this.laudo._id
      });

      await this.uploadFotoFachada(ambiente._id, fotoFachada);

      if (data.itens.length > 0) {
        const itemFila = data.itens.map(item =>
          this.itemService.create({ nome: item.nome, ambiente: ambiente.id })
        );

        const itemPromises = await Promise.all<ItemAmbiente>(itemFila);
        const fotoItemFila = [];

        itemPromises.forEach((item, index) => {
          if (data.itens[index].fotos.length > 0) {
            data.itens[index].fotos.forEach(foto => {
              const file = this.utilsService.dataURItoFile(foto);
              console.log(file);
              fotoItemFila.push(this.uploadFotoItem(item._id, file));
            });
          }
        });

        await Promise.all(fotoItemFila);

        this.loadAmbientes();
      }
    } catch (err) {
      console.log(err);
    }
  }

  uploadFotoFachada(id, file) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = await this.utilsService.makeFileFormData(
          'ambientes',
          id,
          'fotoFachada',
          file
        );

        const upload = await this.utilsService.upload(formData);
        console.log(upload);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  uploadFotoItem(id, files) {
    const formData = this.utilsService.makeFileFormData(
      'itens',
      id,
      'fotos',
      files
    );

    return this.utilsService.upload(formData);
  }

  save() {
    console.log(this.vistoriaId);
    console.log('salvou');
  }

  async delete(ambiente: Ambiente) {
    try {
      const res = await this.ambienteService.delete(ambiente._id);
      console.log(res);
      this.loadAmbientes();
    } catch (err) {
      console.log(err);
    }
  }
}
