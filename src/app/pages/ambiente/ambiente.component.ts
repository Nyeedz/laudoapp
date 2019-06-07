import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {
  ActionSheetController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import { ItemService } from '../../services/item/item.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Ambiente } from '../../shared/entities/ambiente';
import { ItemAmbiente } from '../../shared/entities/item-ambiente';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.scss']
})
export class AmbienteComponent implements OnInit {
  @Input() data: Ambiente;
  form: FormGroup;
  fotoFachada: any;
  itens: ItemAmbiente[] = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private itemService: ItemService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required]
    });

    if (this.data) {
      this.fotoFachada = this.data.fotoFachada;
      this.loadItens();
      this.form.patchValue({
        nome: this.data.nome
      });
    }
  }

  async loadItens() {
    try {
      const res = await this.itemService.findByAmbiente(this.data._id);
      this.itens = res;
    } catch (err) {
      console.log(err);
    }
  }

  async addItem() {
    const modal = await this.modalController.create({
      component: ItemComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log(data);

      if (this.data) {
        this.saveItemToDatabase(data);
      } else {
        this.itens.push(data);
      }
    }
  }

  async removeItem(item: any) {
    await this.itemService.delete(item._id);
    this.loadItens();
  }

  async editItem(item: any) {
    try {
      const modal = await this.modalController.create({
        component: ItemComponent,
        componentProps: {
          data: item
        }
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data) {
        if (this.data) {
          const updatedItem = await this.itemService.update(
            { nome: data.nome },
            item._id
          );
          this.loadItens();
          console.log(updatedItem);
        } else {
          console.log(data)
          console.log(this.itens)
        }
      }
    } catch (err) {
      console.log(err);
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
    if (this.form.invalid && !this.fotoFachada && save) {
      return;
    }

    return await this.modalController.dismiss(
      save
        ? {
            itens: this.itens,
            fotoFachada: this.fotoFachada,
            nome: this.form.getRawValue().nome
          }
        : null
    );
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

  async saveItemToDatabase(data: any) {
    try {
      const itemRes = await this.itemService.create({
        nome: data.nome,
        ambiente: this.data._id
      });

      const filePromises = data.fotos.map(foto => {
        const formData = this.utilsService.makeFileFormData(
          'itens',
          itemRes._id,
          'fotos',
          this.utilsService.dataURItoFile(foto)
        );
        return this.utilsService.upload(formData);
      });
      await Promise.all(filePromises);
      this.loadItens();
    } catch (err) {
      console.log(err);
    }
  }
}
