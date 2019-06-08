import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navController: NavController,
    public toastController: ToastController,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async submit(e: Event) {
    try {
      e.preventDefault();
      if (this.form.invalid) {
        return;
      }

      const user = this.form.getRawValue();
      const res = await this.authService.login(user).toPromise();
      this.navController.navigateRoot('/')
    } catch (err) {
      this.presentToast(`❌ ${err.error.message}`);
    }
  }
}
