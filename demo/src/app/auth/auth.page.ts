import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

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
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onLogin() {
    this.isLoading = true;
    this.authService.login();
    this.loadCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 2000);
      });
  }

  onSubmit(form: NgForm) {
    debugger;
    console.log(form);
  }

  onClickAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
