import { Injectable, OnInit } from '@angular/core';
import { Auth } from '../api/endpoints';
import { IAccount, ICredentials, IUser } from '../models/auth.interface';
import { Client } from '../utils/client';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IMerchant } from '../models/merchant';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  constructor(private client?: Client) {}

  ngOnInit(): void {}
  login(credentials: ICredentials) {
    return this.client?.POST(`${Auth.login}`, { ...credentials });
  }

  signup(user: IUser, accountData: IAccount) {
    return this.client?.POST(`${Auth.signup}`, { user, account: accountData });
  }

  merchantSignup(merchantData: IMerchant) {
    return this.client?.POST(`${Auth.signup}`, merchantData );
  }

  activateAccount(token: string, pin: string) {
    return this.client?.POST(`${Auth.activate}`, { token, pin });
  }
  setToken(token: string) {
    const promise = new Promise((resolve, reject) => {
      sessionStorage.setItem('access-token', token);
      resolve(token);
      reject(Error('There was an error'));
    });
    return promise;
  }

  unsetToken() {
    sessionStorage.removeItem('access-token');
  }

  getToken() {
    return sessionStorage.getItem('access-token');
  }

  data(): IUser {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken() || undefined;

    const decodedToken = jwtHelper.decodeToken(token);
    // const expirationDate = jwtHelper.getTokenExpirationDate(token);
    // const isExpired = jwtHelper.isTokenExpired(token);
    return decodedToken;
  }

  session() {
    const jwtHelper = new JwtHelperService();

    const token = this.getToken();
    const isTokenExpired = token ? jwtHelper.isTokenExpired(token) : true;

    const decodedToken = token ? jwtHelper.decodeToken(token) : null;
    console.log('decoded', decodedToken)

    let username, email, role, id;

    if (decodedToken != null || decodedToken != undefined) {
      username = decodedToken.username;
      email = decodedToken.email;
      role = decodedToken.role;
      id = decodedToken.id
    }

    return { username, isTokenExpired, email, role, id };
  }

  isTokeExpired(): boolean {
    return this.session().isTokenExpired;
  }

  get isAdmin() {
    return this.data().role === 'admin';
  }
}
