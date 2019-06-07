import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ItemAmbiente } from 'src/app/shared/entities/item-ambiente';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async find() {
    const url = environment.apiUrl + 'itens';
    const headers = await this.authService.authHeaders();

    return this.http.get<ItemAmbiente[]>(url, { headers }).toPromise();
  }

  async findByAmbiente(id: string) {
    const url = environment.apiUrl + 'itens?ambiente=' + id;
    const headers = await this.authService.authHeaders();

    return this.http.get<ItemAmbiente[]>(url, { headers }).toPromise();
  }

  async count() {
    const url = environment.apiUrl + 'itens/count';
    const headers = await this.authService.authHeaders();
    return this.http.get(url).toPromise();
  }

  async create(item: any) {
    const url = environment.apiUrl + 'itens';
    const headers = await this.authService.authHeaders();
    return this.http.post<ItemAmbiente>(url, item, { headers }).toPromise();
  }

  async update(item: any, id: string) {
    const url = environment.apiUrl + 'itens/' + id;
    const headers = await this.authService.authHeaders();
    return this.http.put<ItemAmbiente>(url, item, { headers }).toPromise();
  }

  async delete(id: string) {
    const url = environment.apiUrl + 'itens/' + id;
    const headers = await this.authService.authHeaders();
    return this.http.delete<any>(url, { headers }).toPromise();
  }
}
