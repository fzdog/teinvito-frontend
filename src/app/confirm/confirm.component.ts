import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  form: FormGroup;
  loading = true;
  error = '';
  success = '';
  guestName = '';
  confirmed = false;
  confirmationDate: string | null = null;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      attendees: [1, [Validators.required, Validators.min(1)]],
      confirmed: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.http.get<any>(`${environment.apiUrl}/invitado/${this.token}`).subscribe({
      next: data => {
        this.guestName = data.name;
        this.loading = false;
      },
      error: err => {
        this.error = err.error.message || 'Invitación no encontrada.';
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid || this.form.get('confirmed')?.disabled) return;
    this.http.post<any>(`${environment.apiUrl}/invitado/${this.token}/confirmar`, this.form.value).subscribe({
      next: (response) => {
        this.success = response.message || 'Respuesta registrada.';
        this.error = '';
        this.confirmed = true;
        if (response.confirmationDate) {
          this.confirmationDate = new Date(response.confirmationDate).toLocaleString();
        }
      },
      error: err => {
        this.error = err.error.message || 'Error al confirmar asistencia.';
      }
    });
  }
}
