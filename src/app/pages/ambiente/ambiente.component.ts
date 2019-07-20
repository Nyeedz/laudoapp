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
  AlertController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AmbienteService } from '../../services/ambiente/ambiente.service';
import { ItemService } from '../../services/item/item.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Ambiente } from '../../shared/entities/ambiente';
import { ItemAmbiente } from '../../shared/entities/item-ambiente';
import { Laudo } from '../../shared/entities/laudo';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.scss']
})
export class AmbienteComponent implements OnInit {
  @Input() ambiente: Ambiente;
  @Input() laudo: Laudo;
  editor = ClassicEditor;
  model = {
    editorData: ''
  }
  form: FormGroup;
  fotoFachada: string;
  editandoFoto: boolean = false;
  itens: ItemAmbiente[] = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private alertController: AlertController,
    private itemService: ItemService,
    private ambienteService: AmbienteService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required]
    });

    this.form.get('nome').valueChanges.subscribe(val => {
      //coloca a funcao aqui pra ele executar sempre que esse controle em especifico mudar
    })

    console.log(this.laudo)

    if (this.ambiente) {
      console.log(this.ambiente)
      this.loadItens();
      this.form.patchValue({
        nome: this.ambiente.nome
      });

      this.model.editorData = this.ambiente.descricao;
    }
  }

  async loadItens() {
    try {
      const res = await this.itemService.findByAmbiente(this.ambiente._id);
      this.itens = res;
    } catch (err) {
      console.log(err);
    }
  }

  async saveAmbiente() {
    try {
      const { nome } = this.form.getRawValue();
      if (this.form.invalid) {
        const toast = await this.toastController.create({
          message: 'Insira o nome do ambiente',
          duration: 2000,
          position: 'top'
        });

        return toast.present();
      }

      if (this.ambiente) {
        const ambiente = await this.ambienteService.update(
          {
            nome,
            descricao: this.model.editorData
          },
          this.ambiente._id
        );

        if (this.fotoFachada && this.editandoFoto) {
          this.saveFotoFachada(this.fotoFachada);
        }
      } else {
        const ambiente = await this.ambienteService.create({
          nome,
          laudo: this.laudo._id,
          descricao: this.model.editorData
        });

        this.ambiente = ambiente;

        if (this.fotoFachada) {
          this.saveFotoFachada(this.fotoFachada);
        }
      }

      const toast = await this.toastController.create({
        message: 'Ambiente salvo!',
        duration: 2000,
        position: 'top'
      });

      return toast.present();
    } catch (err) {
      console.log(err);
    }
  }

  async addItem() {
    try {
      if (!this.ambiente) {
        const toast = await this.toastController.create({
          message: 'É necessário salvar o ambiente',
          duration: 2000,
          position: 'top'
        });

        return toast.present();
      }

      const modal = await this.modalController.create({
        component: ItemComponent
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data) {
        this.saveItemToDatabase(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async removeItem(item: any) {
    try {
      const alert = await this.alertController.create({
        header: 'Deseja excluir o item?',
        message: 'Esta ação é <strong>irreversível</strong>!!!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: blah => {
              console.log('Confirm Cancel: blah');
            }
          },
          {
            text: 'Confirmar',
            handler: async () => {
              await this.itemService.delete(item._id);
              this.loadItens();
            }
          }
        ]
      });

      await alert.present();
    } catch (err) {
      console.log(err);
    }
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
        const updatedItem = await this.itemService.update(
          { nome: data.nome },
          item._id
        );
        this.loadItens();
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
        this.editandoFoto = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  async saveFotoFachada(URI: string) {
    try {
      const formData = this.utilsService.makeFileFormData(
        'ambiente',
        this.ambiente._id,
        'fotoFachada',
        this.utilsService.dataURItoFile(URI)
      );

      await this.utilsService.upload(formData);
      this.reloadAmbiente();
      this.editandoFoto = false;
      this.fotoFachada = null;
    } catch (err) {
      console.log(err);
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

  async saveItemToDatabase(data: any) {
    try {
      const itemRes = await this.itemService.create({
        nome: data.nome,
        ambiente: this.ambiente._id
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

  async reloadAmbiente() {
    try {
      if (this.ambiente) {
        const ambiente = await this.ambienteService.findById(this.ambiente._id);
        this.ambiente = ambiente;
      }
    } catch(err) {
      console.log(err)
    }
  }
}
