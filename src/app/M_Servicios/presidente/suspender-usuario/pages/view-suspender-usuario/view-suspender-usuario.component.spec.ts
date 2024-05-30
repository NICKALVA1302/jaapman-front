import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuspenderUsuarioComponent } from './view-suspender-usuario.component';

describe('ViewSuspenderUsuarioComponent', () => {
  let component: ViewSuspenderUsuarioComponent;
  let fixture: ComponentFixture<ViewSuspenderUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSuspenderUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSuspenderUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
