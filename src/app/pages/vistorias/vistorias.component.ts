import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  ModalController,
  ToastController,
  NavController
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { VistoriaService } from '../../services/vistoria/vistoria.service';
import { Vistoria } from '../../shared/entities/vistoria';
import { StatusEnum } from '../../shared/enums/status.enum';

@Component({
  selector: 'app-vistorias',
  templateUrl: './vistorias.component.html',
  styleUrls: ['./vistorias.component.scss']
})
export class VistoriasComponent implements OnInit {
  userSubscription: Subscription;
  public vistorias: Vistoria[] = [];

  constructor(
    private storage: Storage,
    private vistoriaService: VistoriaService,
    private authService: AuthService,
    private router: Router,
    private navController: NavController,
    public toastController: ToastController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.createSubscription();
  }

  createSubscription() {
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user) {
        this.loadVistorias();
      }
    });
  }

  async loadVistorias(event?: any) {
    const res = await this.vistoriaService.findMine();
    this.vistorias = res;

    if (event) {
      event.target.complete();
    }
  }

  goToLaudo(vistoria: Vistoria) {
    if (vistoria.status !== StatusEnum.Aberto) {
      return this.alert('Não é possível editar esta vistoria', '❕ ');
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: vistoria.id
      }
    };

    this.navController.navigateForward('/laudo', navigationExtras);

    console.log(vistoria);
  }

  async alert(message: string, prefix?: string) {
    const toast = await this.toastController.create({
      message: `${prefix} ${message}`,
      duration: 2000
    });
    toast.present();
  }
}
