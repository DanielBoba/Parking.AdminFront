import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-dark-bg">

      <!-- Navbar -->
      <nav class="bg-dark-card border-b border-dark-border px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span class="font-bold text-white text-lg">Parking</span>
            <span class="text-accent font-bold text-lg"> Admin</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-dark-muted text-sm hidden sm:block">SuperAdministrator</span>
          <button (click)="logout()" class="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="px-6 py-8 max-w-7xl mx-auto">

        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-2xl font-bold text-white">Tenant Management</h1>
            <p class="text-dark-muted mt-1">Manage all parking tenants in the system.</p>
          </div>
          <button (click)="openModal()" class="btn-primary flex items-center gap-2 self-start">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Tenant
          </button>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="card p-5">
            <p class="text-dark-muted text-sm">Total Tenants</p>
            <p class="text-3xl font-bold text-white mt-1">{{ tenants.length }}</p>
          </div>
          <div class="card p-5">
            <p class="text-dark-muted text-sm">Active</p>
            <p class="text-3xl font-bold text-green-400 mt-1">{{ activeCount }}</p>
          </div>
          <div class="card p-5">
            <p class="text-dark-muted text-sm">Inactive / Suspended</p>
            <p class="text-3xl font-bold text-red-400 mt-1">{{ inactiveCount }}</p>
          </div>
        </div>

        <!-- Error / Loading -->
        <div *ngIf="loadError" class="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-lg mb-6 text-sm">
          {{ loadError }}
        </div>

        <!-- Tenants Table -->
        <div class="card">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-border text-dark-muted text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 text-left">ID</th>
                  <th class="px-6 py-4 text-left">Display Name</th>
                  <th class="px-6 py-4 text-left">Slug</th>
                  <th class="px-6 py-4 text-left">Mode</th>
                  <th class="px-6 py-4 text-left">Shard</th>
                  <th class="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="isLoading">
                  <td colspan="6" class="px-6 py-12 text-center text-dark-muted">
                    <div class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Loading tenants...
                    </div>
                  </td>
                </tr>
                <tr *ngIf="!isLoading && tenants.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-dark-muted">No tenants found. Create your first one!</td>
                </tr>
                <tr 
                  *ngFor="let tenant of tenants" 
                  class="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors"
                >
                  <td class="px-6 py-4 font-mono text-dark-muted">{{ tenant.id }}</td>
                  <td class="px-6 py-4 font-medium text-white">{{ tenant.displayName }}</td>
                  <td class="px-6 py-4 font-mono text-dark-muted text-xs">{{ tenant.slug }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs" 
                      [ngClass]="tenant.deploymentMode === 'Dedicated' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary-hover'">
                      {{ tenant.deploymentMode || 'Shared' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-dark-muted">{{ tenant.shardId }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      [ngClass]="tenant.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                      <span class="w-1.5 h-1.5 rounded-full" 
                        [ngClass]="tenant.status === 'Active' ? 'bg-green-400' : 'bg-red-400'"></span>
                      {{ tenant.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <!-- Create Tenant Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" (click)="closeModal($event)">
        <div class="card w-full max-w-lg p-6 animate-slide-up" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Create New Tenant</h2>
            <button (click)="showModal = false" class="text-dark-muted hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div *ngIf="createSuccess" class="bg-green-500/10 border border-green-500/40 text-green-400 p-3 rounded-md mb-4 text-sm">
            ✅ Tenant created! ID: <strong>{{ createdTenantId }}</strong>
          </div>
          <div *ngIf="createError" class="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-md mb-4 text-sm">
            {{ createError }}
          </div>

          <form [formGroup]="createForm" (ngSubmit)="createTenant()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label-text">Display Name</label>
                <input formControlName="displayName" class="input-field" placeholder="Parking Norte" />
              </div>
              <div>
                <label class="label-text">Slug (unique ID)</label>
                <input formControlName="slug" class="input-field" placeholder="parking-norte" />
              </div>
            </div>

            <div class="border-t border-dark-border pt-4">
              <p class="text-xs text-dark-muted uppercase tracking-wider font-medium mb-3">Admin User</p>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="label-text">Name</label>
                    <input formControlName="adminName" class="input-field" placeholder="Juan" />
                  </div>
                  <div>
                    <label class="label-text">Surname</label>
                    <input formControlName="adminSurname" class="input-field" placeholder="García" />
                  </div>
                </div>
                <div>
                  <label class="label-text">Admin Email</label>
                  <input formControlName="adminEmail" type="email" class="input-field" placeholder="admin@parking-norte.com" />
                </div>
                <div>
                  <label class="label-text">Admin Password</label>
                  <input formControlName="adminPassword" type="password" class="input-field" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" (click)="showModal = false" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="createForm.invalid || isCreating" class="btn-primary flex-1 flex justify-center items-center gap-2">
                <svg *ngIf="isCreating" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isCreating ? 'Creating...' : 'Create Tenant' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  tenants: Tenant[] = [];
  isLoading = true;
  loadError = '';
  showModal = false;
  isCreating = false;
  createError = '';
  createSuccess = false;
  createdTenantId: number | null = null;

  createForm: FormGroup;

  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      displayName: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      adminName: ['', Validators.required],
      adminSurname: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.loadTenants();
  }

  get activeCount() {
    return this.tenants.filter(t => t.status === 'Active').length;
  }

  get inactiveCount() {
    return this.tenants.filter(t => t.status !== 'Active').length;
  }

  loadTenants() {
    this.isLoading = true;
    this.tenantService.getAll().subscribe({
      next: (data) => {
        this.tenants = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.loadError = err.status === 401
          ? 'Access denied. Make sure you are logged in as SuperAdministrator.'
          : 'Could not load tenants. Is the API running?';
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.createSuccess = false;
    this.createError = '';
    this.createForm.reset();
  }

  closeModal(event: Event) {
    this.showModal = false;
  }

  createTenant() {
    if (this.createForm.invalid) return;
    this.isCreating = true;
    this.createError = '';
    this.createSuccess = false;

    const request = this.createForm.value;
    this.tenantService.create(request).subscribe({
      next: (res) => {
        this.isCreating = false;
        this.createSuccess = true;
        this.createdTenantId = res.tenantId;
        this.createForm.reset();
        // Reload list
        this.loadTenants();
      },
      error: (err) => {
        this.isCreating = false;
        this.createError = err.error?.message || 'Failed to create tenant. Check CORS or API status.';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
