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
import { ItemService } from 'src/app/services/item/item.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ItemAmbiente } from 'src/app/shared/entities/item-ambiente';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() data: ItemAmbiente;
  form: FormGroup;
  fotos: any[] = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private utilsService: UtilsService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required]
    });

    if (this.data) {
      console.log(this.data);
      this.form.patchValue({ nome: this.data.nome });
      this.fotos = this.data.fotos;
    }
  }

  async back(save: boolean) {
    this.form.updateValueAndValidity();

    if (this.form.invalid && save) {
      return;
    }

    return await this.modalController.dismiss(
      save ? { fotos: this.fotos, nome: this.form.value.nome } : null
    );
  }

  async removeFoto(index: number) {
    try {
      if (this.data) {
        const foto = this.fotos[index];
        await this.utilsService.deleteFile(foto._id);
      }

      this.fotos.splice(index, 1);
    } catch (err) {
      console.log(err);
    }
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
      imagePath => {
        if (!imagePath) {
          return;
        }

        if (this.data) {
          this.saveItemPicture(`data:image/jpeg;base64,${imagePath}`);
        } else {
          this.fotos.push(`data:image/jpeg;base64,${imagePath}`);
        }
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

  async saveItemPicture(URI: string) {
    try {
      const formData = this.utilsService.makeFileFormData(
        'itens',
        this.data._id,
        'fotos',
        this.utilsService.dataURItoFile(URI)
      );

      const upload = await this.utilsService.upload(formData);
      const foto = { ...upload[0], url: '/uploads/' + upload[0].hash };
      this.fotos.push(foto);
    } catch (err) {
      console.log(err);
    }
  }
}
