import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../../environments/environment';
import { Ambiente } from '../../shared/entities/ambiente';
import { AuthService } from '../auth/auth.service';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class AmbienteService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private storage: Storage
  ) {}

  async find() {
    const url = environment.apiUrl + 'ambientes';
    const headers = await this.authService.authHeaders();

    return this.http.get<Ambiente[]>(url, { headers }).toPromise();
  }

  async findByLaudo(id: string) {
    const url = environment.apiUrl + 'ambientes?laudo=' + id;
    const headers = await this.authService.authHeaders();

    return this.http.get<Ambiente[]>(url, { headers }).toPromise();
  }

  async findById(id: string) {
    const url = environment.apiUrl + 'ambientes/' + id;
    const headers = await this.authService.authHeaders();

    return this.http.get<Ambiente>(url, { headers }).toPromise();
  }

  async count() {
    const url = environment.apiUrl + 'ambientes/count';
    const headers = await this.authService.authHeaders();
    return this.http.get(url, { headers }).toPromise();
  }

  async create(ambiente: any) {
    const url = environment.apiUrl + 'ambientes';
    const headers = await this.authService.authHeaders();
    return this.http.post<Ambiente>(url, ambiente, { headers }).toPromise();
  }

  async update(ambiente: any, id: string) {
    const url = environment.apiUrl + 'ambientes/' + id;
    const headers = await this.authService.authHeaders();
    return this.http.put<Ambiente>(url, ambiente, { headers }).toPromise();
  }

  async delete(id: string) {
    const url = environment.apiUrl + 'ambientes/' + id;
    const headers = await this.authService.authHeaders();
    return this.http.delete<any>(url, { headers }).toPromise();
  }

  async findStorage(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const ambientes = await this.storage.get('ambientes');

      if (!ambientes) {
        return resolve([]);
      }

      return resolve(
        ambientes.filter(ambiente => {
          return ambiente.laudo._id === id;
        })
      );
    });
  }
}
