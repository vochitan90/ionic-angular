import { environment } from './../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';

export interface AuthResponseData {
  localId: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  //public _userIsAuthenticated = true;
  //private _userId = null;
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        return user ? !!user.token : false; // convert to boolean
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        return user ? user.id : null;
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        return user ? user.token : null;
      })
    );
  }

  constructor(private httpClient: HttpClient) {}

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        // Convert string back to object
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null; // het han
        }

        const user = new User(
          parsedData.userId,
          parsedData.token,
          parsedData.email,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration); // auto logout in 1 hours
        }
      }),
      map((user) => {
        return !!user; // return true/ false
      })
    );
  }

  signup(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseAPIKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseAPIKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = {
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email,
    };
    Storage.set({
      key: 'authData',
      value: JSON.stringify(data),
    });
  }

  private setUserData(userData: AuthResponseData) {
    // Ngay hien tai cong them thoi gian het han (1 giờ)
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );

    const newUser = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(newUser);
    this.autoLogout(newUser.tokenDuration); // auto logout in 1 hours
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearInterval(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearInterval(this.activeLogoutTimer);
    }
  }

  logout() {
    //this._userIsAuthenticated = false;
    if (this.activeLogoutTimer) {
      clearInterval(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({ key: 'authData' });
  }
}
