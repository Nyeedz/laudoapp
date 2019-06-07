import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    public toastController: ToastController,
    private router: Router
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
      console.log(res);
    } catch (err) {
      this.presentToast(`❌ ${err.error.message}`);
    }
  }
}
