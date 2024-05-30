import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElimInstalacionComponent } from './elim-instalacion.component';

describe('ElimInstalacionComponent', () => {
  let component: ElimInstalacionComponent;
  let fixture: ComponentFixture<ElimInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElimInstalacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElimInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
