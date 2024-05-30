import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDinstalacionComponent } from './view-dinstalacion.component';

describe('ViewDinstalacionComponent', () => {
  let component: ViewDinstalacionComponent;
  let fixture: ComponentFixture<ViewDinstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDinstalacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDinstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
