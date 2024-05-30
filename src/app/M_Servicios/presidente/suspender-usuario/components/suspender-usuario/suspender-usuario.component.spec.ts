import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenderUsuarioComponent } from './suspender-usuario.component';

describe('SuspenderUsuarioComponent', () => {
  let component: SuspenderUsuarioComponent;
  let fixture: ComponentFixture<SuspenderUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspenderUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuspenderUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
