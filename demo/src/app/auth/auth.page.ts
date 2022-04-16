import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';
import { element } from 'protractor';
import { debug } from 'console';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    //this.authService.login(email, password).subscribe((res) => {});
    this.loadCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          // send a request to signup servers
          authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
          (res) => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (errRes) => {
            this.isLoading = false;
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address already existed!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Email not found!';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Invalid password';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);

    form.reset();
  }

  private async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay'],
    });

    alert.present();
  }

  onClickAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
