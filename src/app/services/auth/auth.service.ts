import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network, Connection } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import environment from '../../../environments/environment';
import { LoginDTO } from '../../shared/dto/login.dto';
import { User } from '../../shared/entities/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token: string = null;
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public user: Observable<User> = this.user$.asObservable();

  constructor(private http: HttpClient, private storage: Storage, private network: Network) {
    this.load();
  }

  public get userValue(): User {
    return this.user$.value;
  }

  get token() {
    return this._token;
  }

  login(object: LoginDTO) {
    return this.http.post<any>(`${environment.apiUrl}auth/local`, object).pipe(
      map(res => {
        if (res && res.jwt) {
          this.storage.set('user', res.user);
          this.storage.set('jwt', res.jwt);
          this.user$.next(res.jwt);
          this._token = res.jwt;
        }

        return res;
      })
    );
  }

  async load() {
    const user = await this.storage.get('user');
    const jwt = await this.storage.get('jwt');

    if (!jwt) {
      this.logout();
      return null;
    }

    this._token = jwt;

    if (!navigator.onLine || this.network.type === 'none') {
      this.loadUserFromStorage();
    } else {
      this.loadUser();
    }

  }

  async loadUser() {
    try {
      const url = environment.apiUrl + 'users/me';
      const headers = await this.authHeaders();
      const user = await this.http.get<any>(url, { headers }).toPromise();

      this.storage.set('user', user);
      this.user$.next(user);
      this._token = user.jwt;
    } catch (exception) {
      this.logout();
    }
  }

  async loadUserFromStorage() {
    const user = await this.storage.get('user');
    const jwt = await this.storage.get('jwt');

    this.storage.set('user', user);
    this.user$.next(user);
    this._token = jwt;
  }

  logout() {
    this.storage.clear();
    this.user$.next(null);
    this._token = null;
  }

  async authHeaders() {
    const jwt = await this.storage.get('jwt');

    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`
    });
  }
}
