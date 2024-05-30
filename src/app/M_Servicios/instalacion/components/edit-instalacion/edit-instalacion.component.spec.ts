import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstalacionComponent } from './edit-instalacion.component';

describe('EditInstalacionComponent', () => {
  let component: EditInstalacionComponent;
  let fixture: ComponentFixture<EditInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditInstalacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
