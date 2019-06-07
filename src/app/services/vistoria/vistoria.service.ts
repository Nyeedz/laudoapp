import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import environment from '../../../environments/environment';
import { Vistoria } from '../../shared/entities/vistoria';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class VistoriaService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async find() {
    const url = environment.apiUrl + 'vistorias';
    const headers = await this.authService.authHeaders();

    return this.http.get<Vistoria[]>(url, { headers }).toPromise();
  }

  async findMine() {
    const url = environment.apiUrl + 'vistorias?user=' + this.authService.userValue.id;
    const headers = await this.authService.authHeaders();
    return this.http
      .get<any>(url, { headers })
      .toPromise();
  }

  count() {
    const url = environment.apiUrl + 'vistorias/count';

    return this.http.get(url).toPromise();
  }

  create(vistoria: any) {
    const url = environment.apiUrl + 'vistorias';

    return this.http.post(url, vistoria).toPromise();
  }
}
