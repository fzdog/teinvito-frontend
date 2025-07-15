import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invitation-card',
  standalone: true,
  imports: [CommonModule],
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
  private aspectRatio: number | null = null;

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
}
