import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  /** Champ honeypot : jamais rempli par un humain, toujours vide. */
  readonly website: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(data: ContactPayload) {
    return this.http.post<{ ok: boolean }>('/api/contact', data);
  }
}
