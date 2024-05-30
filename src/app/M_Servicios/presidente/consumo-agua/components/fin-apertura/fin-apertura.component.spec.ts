import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinAperturaComponent } from './fin-apertura.component';

describe('FinAperturaComponent', () => {
  let component: FinAperturaComponent;
  let fixture: ComponentFixture<FinAperturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinAperturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinAperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
