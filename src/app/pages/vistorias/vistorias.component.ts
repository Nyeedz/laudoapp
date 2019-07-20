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
import { User } from '../../shared/entities/user';

@Component({
  selector: 'app-vistorias',
  templateUrl: './vistorias.component.html',
  styleUrls: ['./vistorias.component.scss']
})
export class VistoriasComponent implements OnInit {
  public userSubscription: Subscription;
  public vistorias: Vistoria[] = [];
  public user: User;

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
    this.createUserSubscription();
  }

  ionViewDidEnter() {
    if (this.user) {
      this.loadVistorias();
    }
  }

  createUserSubscription() {
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadVistorias();
      }
    });
  }

  async loadVistorias(event?: any) {
    const res = await this.vistoriaService.find();

    this.vistorias = res.filter(vistoria => {
      return !(!vistoria.user || vistoria.user.id !== this.user.id);
    });

    if (event) {
      event.target.complete();
    }
  }

  goToLaudo(vistoria: Vistoria) {
    if (vistoria.status !== StatusEnum.Aberto) {
      return this.alert('Só é possível editar vistorias "Em Aberto"', '❕ ');
    }

    if (!vistoria.laudo) {
      return this.alert('Erro ao acessar laudo', '❕ ');
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: vistoria.laudo._id
      }
    };

    this.navController.navigateForward('/laudo', navigationExtras);
  }

  async alert(message: string, prefix?: string) {
    const toast = await this.toastController.create({
      message: `${prefix} ${message}`,
      duration: 2000
    });
    toast.present();
  }

  logout() {
    this.authService.logout();
    this.navController.navigateRoot('/login');
  }
}
