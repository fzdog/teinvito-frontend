import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface Guest {
  name: string;
  token: string;
  confirmed: boolean;
  attendees: number;
  confirmationDate?: string;
  foto?: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  guests: Guest[] = [];
  totalAttendees: number = 0;
  notConfirmed: number = 0;
  success = '';
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      foto: [''],
    });
  }

  ngOnInit() {
    this.getGuests();
  }

  getGuests() {
    this.loading = true;
    this.http.get<Guest[]>(`${environment.apiUrl}/invitado/all`).subscribe({
      next: (guests) => {
        this.guests = guests;
        // Calcular asistentes confirmados y no confirmados
        this.totalAttendees = guests
          .filter((g) => g.confirmed)
          .reduce((sum, g) => sum + (g.attendees || 0), 0);
        this.notConfirmed = guests.filter((g) => !g.confirmed).length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addGuest() {
    if (this.form.invalid) return;
    this.http
      .post<any>(`${environment.apiUrl}/invitado`, this.form.value)
      .subscribe({
        next: (res) => {
          this.success = 'Invitado agregado.';
          this.error = '';
          this.form.reset();
          this.getGuests();
        },
        error: (err) => {
          this.error = err.error.message || 'Error al agregar invitado.';
          this.success = '';
        },
      });
  }
}
