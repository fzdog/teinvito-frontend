import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationCardComponent } from './invitation-card.component';

describe('InvitationCardComponent', () => {
  let component: InvitationCardComponent;
  let fixture: ComponentFixture<InvitationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
