import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-invitation-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invitation-card.component.html',
  styleUrl: './invitation-card.component.scss',
})
export class InvitationCardComponent implements OnInit, AfterViewInit {
  @ViewChild('invitation', { static: true })
  invitationRef!: ElementRef<HTMLDivElement>;
  @ViewChild('invitationImg') invitationImgRef!: ElementRef<HTMLImageElement>;

  userName = '';
  // trae la imagen de un usuario, de assets/images/usuario.png
  // en este caso, la imagen es 'lopera.png'
  imageURL = ''; // Placeholder image
  toggled = true;
  animating = false;
  isFlippingOut = false;
  isFlippingIn = false;
  showConfirmation = false;
  confirmForm: FormGroup;
  guestName = 'Invitado';
  confirmed = false;
  success = '';
  confirmationDate: string | null = null;
  private aspectRatio: number | null = null;

  // Propiedades para validación de token
  loading = true;
  error = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.confirmForm = this.fb.group({
      attendees: [1, [Validators.required, Validators.min(1)]],
      confirmed: [null, Validators.required],
    });

    // Escuchar cambios en el campo 'confirmed' para ajustar el comportamiento de 'attendees'
    this.confirmForm.get('confirmed')?.valueChanges.subscribe((willAttend) => {
      const attendeesControl = this.confirmForm.get('attendees');

      if (willAttend === false) {
        // Si no va a asistir, establecer attendees en 0 y deshabilitar
        attendeesControl?.setValue(0);
        attendeesControl?.disable();
        // Remover validaciones cuando no asiste
        attendeesControl?.clearValidators();
      } else if (willAttend === true) {
        // Si va a asistir, habilitar el campo y restaurar validaciones
        attendeesControl?.enable();
        attendeesControl?.setValue(1);
        attendeesControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
      }
      attendeesControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.http
      .get<any>(`${environment.apiUrl}/invitado/${this.token}`)
      .subscribe({
        next: (data) => {
          console.log('Guest data:', data);
          this.guestName = data.name;
          this.imageURL = '/assets/images/' + data.foto + '.png';
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error.message || 'Invitación no encontrada.';
          this.loading = false;
        },
      });
  }

  ngAfterViewInit() {}

  onImgLoad() {
    const img = this.invitationImgRef.nativeElement;
    if (!this.aspectRatio) {
      this.aspectRatio = img.naturalHeight / img.naturalWidth;
      this.setFixedHeight();
      window.addEventListener('resize', () => this.setFixedHeight());
    }
  }

  private setFixedHeight() {
    const el = this.invitationRef.nativeElement;
    const w = el.offsetWidth;
    el.style.height = `${w * (this.aspectRatio || 1)}px`;
  }

  flip() {
    if (this.animating) return;
    this.animating = true;
    this.isFlippingOut = true;

    // 1) tras 300ms (flip-out), cambiamos contenido y arrancamos flip-in
    setTimeout(() => {
      this.isFlippingOut = false;
      this.toggled = !this.toggled;
      this.isFlippingIn = true;

      // 2) tras otros 300ms (flip-in), limpiamos banderas y permitimos nuevo flip
      setTimeout(() => {
        this.isFlippingIn = false;
        this.animating = false;
      }, 300);
    }, 300);
  }

  showConfirm() {
    if (this.animating) return;
    this.animating = true;
    this.isFlippingOut = true;

    // Después del flip-out, mostramos la confirmación con efecto flipInY
    setTimeout(() => {
      this.isFlippingOut = false;
      this.showConfirmation = true;
      this.isFlippingIn = true;

      // Agregar clase flipInY al elemento
      const element = this.invitationRef.nativeElement;
      element.classList.add('flipInY');

      setTimeout(() => {
        this.isFlippingIn = false;
        this.animating = false;
        element.classList.remove('flipInY');
      }, 600); // 600ms para que coincida con la duración de flipInY
    }, 300);
  }

  submitConfirmation() {
    if (this.confirmForm.invalid) return;

    this.http
      .post<any>(
        `${environment.apiUrl}/invitado/${this.token}/confirmar`,
        this.confirmForm.value
      )
      .subscribe({
        next: (response) => {
          this.success = response.message || 'Respuesta registrada.';
          this.error = '';
          this.confirmed = true;
          if (response.confirmationDate) {
            this.confirmationDate = new Date(
              response.confirmationDate
            ).toLocaleString();
          }
        },
        error: (err) => {
          this.error = err.error.message || 'Error al confirmar asistencia.';
          this.success = '';
        },
      });
  }

  goBack() {
    if (this.animating) return;
    this.animating = true;
    this.isFlippingOut = true;

    setTimeout(() => {
      this.isFlippingOut = false;
      this.showConfirmation = false;
      this.confirmed = false;
      this.success = '';
      this.error = '';
      this.confirmationDate = null;
      // Resetear el formulario a sus valores iniciales
      this.confirmForm.reset({
        attendees: 1,
        confirmed: null,
      });
      // Asegurar que el campo attendees esté habilitado y con validaciones
      const attendeesControl = this.confirmForm.get('attendees');
      attendeesControl?.enable();
      attendeesControl?.setValidators([Validators.required, Validators.min(1)]);
      attendeesControl?.updateValueAndValidity();
      this.isFlippingIn = true;

      // Agregar clase flipInY al elemento para el efecto de retorno
      const element = this.invitationRef.nativeElement;
      element.classList.add('flipInY');

      setTimeout(() => {
        this.isFlippingIn = false;
        this.animating = false;
        element.classList.remove('flipInY');
      }, 600); // 600ms para que coincida con la duración de flipInY
    }, 300);
  }
}
