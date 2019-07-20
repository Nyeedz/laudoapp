import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ModalController,
  AlertController,
  NavController,
  ActionSheetController
} from '@ionic/angular';
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
import { ActionSheetOptions } from '@ionic/core';
import {
  PictureSourceType,
  Camera,
  CameraOptions
} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-laudo',
  templateUrl: './laudo.component.html',
  styleUrls: ['./laudo.component.scss']
})
export class LaudoComponent implements OnInit {
  visible = 'cadastrados';
  laudoId: string;
  laudo: Laudo;
  editandoFoto = false;
  fotoCaracterizacao: any;
  ambientes: Ambiente[] = [];
  ambientesStorage: Ambiente[] = [];

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    private navController: NavController,
    private camera: Camera,
    private actionSheetController: ActionSheetController,
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
        this.laudoId = id;
        this.loadLaudo(id);
      }
    });
  }

  async saveLaudo() {
    try {
      if (!this.laudo.vistoria) {
        return;
      }

      const vistoria = await this.vistoriaService.update(
        { status: 'Em andamento' },
        this.laudo.vistoria._id
      );

      this.navController.pop();
    } catch (err) {
      console.log(err);
    }
  }

  async showSaveDialog() {
    try {
      const alert = await this.alertController.create({
        header: 'Deseja continuar?',
        message:
          'Ao confirmar, o laudo irá para análise e <strong>NÃO PODERÁ</strong> ser editado!!!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: blah => {
              console.log('Confirm Cancel: blah');
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.saveLaudo();
            }
          }
        ]
      });

      await alert.present();
    } catch (err) {
      console.log(err);
    }
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
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  }

  async deleteAmbiente(ambiente: Ambiente) {
    try {
      const res = await this.ambienteService.delete(ambiente._id);
      console.log(res);
      this.loadAmbientes();
    } catch (err) {
      console.log(err);
    }
  }

  loadAmbientes(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const ambientes = await this.ambienteService.findByLaudo(this.laudo._id);
      console.log(ambientes);
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

  async loadLaudo(id?: any): Promise<void> {
    try {
      console.log(id);
      const laudo = await this.laudoService.findById(id);
      this.laudo = laudo;
      console.log(this.laudo);
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

  async selectImage() {
    const options: ActionSheetOptions = {
      header: 'Escolha uma opção',
      buttons: [
        {
          text: 'Carregue da galeria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    };
    const actionSheet = await this.actionSheetController.create(options);
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };

    this.camera.getPicture(options).then(
      imageData => {
        console.log(imageData);
        this.fotoCaracterizacao = `data:image/jpeg;base64,${imageData}`;
        this.editandoFoto = true;
        this.saveFotoCaracterizacao(this.fotoCaracterizacao);
      },
      err => {
        console.log(err);
      }
    );
  }

  switchLists(list: string) {
    this.visible = list;
    console.log(this.visible);
  }

  async saveFotoCaracterizacao(URI: string) {
    try {
      const formData = this.utilsService.makeFileFormData(
        'vistoria',
        this.laudo.vistoria._id,
        'fotoCaracterizacao',
        this.utilsService.dataURItoFile(URI)
      );

      await this.utilsService.upload(formData);
      this.loadAmbientes();
      this.editandoFoto = false;
      this.fotoCaracterizacao = null;
    } catch (err) {
      console.log(err);
    }
  }
}
