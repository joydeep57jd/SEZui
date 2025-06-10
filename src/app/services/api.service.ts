import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  get(url: string, params: any = {}) {
    return this.http.get(url, { params });
  }

  post(url: string, data: any) {
    return this.http.post(url, data);
  }

  put(url: string, data: any) {
    return this.http.put(url, data);
  }

  delete(url: string) {
    return this.http.delete(url);
  }
}
