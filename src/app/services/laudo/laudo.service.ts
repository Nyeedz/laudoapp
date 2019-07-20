import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../../environments/environment';
import { Laudo } from '../../shared/entities/laudo';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class LaudoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async find() {
    const url = environment.apiUrl + 'laudos';
    const headers = await this.authService.authHeaders();

    return this.http.get<Laudo[]>(url, { headers }).toPromise();
  }

  async findOne(id: string) {
    const url = environment.apiUrl + 'laudos?vistoria=' + id;
    const headers = await this.authService.authHeaders();
    return this.http.get<any>(url, { headers }).toPromise();
  }

  async findById(id: string) {
    const url = environment.apiUrl + 'laudos/' + id;
    const headers = await this.authService.authHeaders();
    return this.http.get<any>(url, { headers }).toPromise();
  }

  count() {
    const url = environment.apiUrl + 'laudos/count';

    return this.http.get(url).toPromise();
  }

  create(laudo: any) {
    const url = environment.apiUrl + 'laudos';

    return this.http.post(url, laudo).toPromise();
  }
}
