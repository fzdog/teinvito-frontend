import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invitation-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invitation-card.component.html',
  styleUrl: './invitation-card.component.scss',
})
export class InvitationCardComponent implements AfterViewInit {
  @ViewChild('invitation', { static: true })
  invitationRef!: ElementRef<HTMLDivElement>;
  @ViewChild('invitationImg') invitationImgRef!: ElementRef<HTMLImageElement>;

  userName = 'mata-cata';
  // trae la imagen de un usuario, de assets/images/usuario.png
  // en este caso, la imagen es 'lopera.png'
  imageURL = '/assets/images/' + this.userName + '.png'; // Placeholder image
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

  constructor(private fb: FormBuilder) {
    this.confirmForm = this.fb.group({
      attendees: [1, [Validators.required, Validators.min(1)]],
      confirmed: [null, Validators.required]
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
    
    // Simulamos el envío de la confirmación
    this.success = '¡Confirmación registrada exitosamente!';
    this.confirmed = true;
    this.confirmationDate = new Date().toLocaleString();
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
      this.confirmationDate = null;
      // Resetear el formulario a sus valores iniciales
      this.confirmForm.reset({
        attendees: 1,
        confirmed: null
      });
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
