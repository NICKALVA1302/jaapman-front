import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaterialesComponent } from './add-edit-materiales.component';

describe('AddEditMaterialesComponent', () => {
  let component: AddEditMaterialesComponent;
  let fixture: ComponentFixture<AddEditMaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMaterialesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
