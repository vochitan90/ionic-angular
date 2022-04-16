import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {}

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
  }

  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      debugger;
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigate(['/auth']);
      }
      this.previousAuthState = isAuth;
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
