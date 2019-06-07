import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from '@ionic-native/camera/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import { ItemAmbiente } from '../../shared/entities/item-ambiente';

@Component({
  selector: 'app-environment-item',
  templateUrl: './environment-item.component.html',
  styleUrls: ['./environment-item.component.scss']
})
export class EnvironmentItemComponent implements OnInit {
  @Input() data: ItemAmbiente;
  form: FormGroup;
  fotos: string[] = [];

  constructor(
    public modalController: ModalController,
    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required]
    });

    if (this.data) {
      this.form.patchValue({ nome: this.data.nome });
      // this.fotos = this.data.fotos;
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

  removeFoto(index: number) {
    this.fotos.splice(index, 1);
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
        this.fotos.push(`data:image/jpeg;base64,${imagePath}`);
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
