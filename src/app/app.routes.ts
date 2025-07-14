import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ConfirmComponent } from './confirm/confirm.component';

export const routes: Routes = [
    { path: 'admin-app', component: AdminComponent },
    { path: 'confirmar/:token', component: ConfirmComponent },
    { path: '**', redirectTo: 'confirmar/demo-token' }
];