import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface SimulationDetectRequest {
  plateText: string;
  confidence: number;
  cameraId: string;
  cameraName: string;
  vehicleType: string;
  includeFrame: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  private apiUrl = `${environment.apiUrl}/api/simulation`;

  constructor(private http: HttpClient) { }

  /**
   * Simula una detección de cámara enviando los datos al backend
   */
  simulateDetection(request: SimulationDetectRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/detect`, request);
  }
}
