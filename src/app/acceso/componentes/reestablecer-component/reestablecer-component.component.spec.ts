import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReestablecerComponentComponent } from './reestablecer-component.component';

describe('ReestablecerComponentComponent', () => {
  let component: ReestablecerComponentComponent;
  let fixture: ComponentFixture<ReestablecerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReestablecerComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReestablecerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
