import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { InvitationCardComponent } from './invitation-card/invitation-card.component';

export const routes: Routes = [
  { path: 'admin-app', component: AdminComponent },
  { path: 'confirmar/:token', component: ConfirmComponent },
  { path: 'invitation-card', component: InvitationCardComponent },
  { path: '**', redirectTo: 'confirmar/demo-token' },
];
