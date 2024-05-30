import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRepClienSusComponent } from './view-rep-clien-sus.component';

describe('ViewRepClienSusComponent', () => {
  let component: ViewRepClienSusComponent;
  let fixture: ComponentFixture<ViewRepClienSusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRepClienSusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRepClienSusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
