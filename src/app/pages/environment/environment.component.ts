import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import { ItemAmbiente } from '../../shared/entities/item-ambiente';
import { EnvironmentItemComponent } from '../environment-item/environment-item.component';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit {
  @Input() data: any;
  fotoFachada: string = null;
  itens: ItemAmbiente[] = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    if (this.data) {
      this.fotoFachada = this.data.fotoFachada;
      this.itens = this.data.itens;
    }
  }

  async addItem() {
    const modal = await this.modalController.create({
      component: EnvironmentItemComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.itens.push(data);
    }
  }

  async removeItem(index: number) {
    this.itens.splice(index, 1);
  }

  async editItem(index: number) {
    const modal = await this.modalController.create({
      component: EnvironmentItemComponent,
      componentProps: {
        data: this.itens[index]
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.itens[index] = data;
    }
  }

  pathForImage(img: any) {
    if (img === null) {
      return;
    } else {
      const converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });

    toast.present();
  }

  async back(save: boolean) {
    if (!this.fotoFachada && save) {
      return;
    }

    return await this.modalController.dismiss(save ? { itens: this.itens, fotoFachada: this.fotoFachada } : null);
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
        this.fotoFachada = `data:image/jpeg;base64,${imageData}`;
      },
      err => {
        console.log(err);
      }
    );
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
}
