import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import environment from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async base64toFile(base64: string) {
    return this.http.get(base64).toPromise();
  }

  dataURItoFile(dataURI: string) {
    const splitURI = dataURI.split(',');
    const byteString = window.atob(splitURI[1]);
    const type = this.base64MimeType(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type });
    const imageFile = new File([blob], 'fachada', { type });

    console.log(imageFile)
    return imageFile;
  }

  base64MimeType(encoded) {
    if (typeof encoded !== 'string') {
      throw Error();
    }

    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      return mime[1];
    }
  }

  makeFileFormData(ref: string, refId: string, field: string, file: any, multiFile: boolean = false) {
    const formData = new FormData();
    formData.append('ref', ref);
    formData.append('refId', refId);
    formData.append('field', field);

    if (multiFile) {
      file.forEach(f => formData.append('files[]', f));
    } else {
      formData.append('files', file)
    }
    return formData;
  }

  async upload(formData: FormData) {
    console.log(formData)
    const url = environment.apiUrl + 'upload';
    const headers = await this.authService.authHeaders();

    return this.http.post<any>(url, formData, { headers }).toPromise();
  }
}
