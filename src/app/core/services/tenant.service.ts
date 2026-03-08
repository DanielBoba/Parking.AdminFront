import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tenant {
  id: number;
  slug: string;
  displayName: string;
  status: string;
  deploymentMode: string;
  shardId: number;
  createdAt: string;
}

export interface CreateTenantWithAdminRequest {
  slug: string;
  displayName: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  adminSurname: string;
}

export interface RegistrationResponse {
  userName: string;
  email: string;
  token: string;
  tenantId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.apiUrl}/Tenant`);
  }

  create(request: CreateTenantWithAdminRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/Tenant`, request);
  }
}
