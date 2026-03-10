import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimulatorService, SimulationDetectRequest } from '../../core/services/simulator.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {
  simulateForm: FormGroup;
  isSubmitting = false;
  lastSimulationResult: any = null;
  errorMessage: string | null = null;
  
  // SuperAdmin Tenant Selection
  isSuperAdmin = false;
  tenants: Tenant[] = [];

  constructor(
    private fb: FormBuilder, 
    private simulatorService: SimulatorService,
    private tenantService: TenantService,
    private authService: AuthService
  ) {
    this.simulateForm = this.fb.group({
      targetTenantId: [''],
      plateText: ['', [Validators.required, Validators.minLength(3)]],
      confidence: [0.95, [Validators.required, Validators.min(0), Validators.max(1)]],
      cameraId: ['cam-sim-01', Validators.required],
      cameraName: ['Entrada Simulada', Validators.required],
      vehicleType: ['Auto', Validators.required],
      includeFrame: [true]
    });
  }

  ngOnInit() {
    this.checkSuperAdminAndLoadTenants();
  }

  checkSuperAdminAndLoadTenants() {
    const roles = this.authService.getRoles();
    if (roles.includes('SuperAdministrator')) {
      this.isSuperAdmin = true;
      // Fetch tenants so SuperAdmin can choose where to simulate
      this.tenantService.getAll().subscribe({
        next: (data) => this.tenants = data,
        error: (err) => console.error('Failed to load tenants for simulation', err)
      });
    }
  }

  onSubmit() {
    if (this.simulateForm.invalid) {
      this.simulateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.lastSimulationResult = null;

    const request: SimulationDetectRequest = this.simulateForm.value;

    this.simulatorService.simulateDetection(request).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.lastSimulationResult = res;
        // Optionally flash a success message and then hide it
        setTimeout(() => this.lastSimulationResult = null, 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Error occurred during simulation';
        console.error('Simulation error:', err);
      }
    });
  }
}
