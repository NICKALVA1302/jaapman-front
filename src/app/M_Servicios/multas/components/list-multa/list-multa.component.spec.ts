import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMultaComponent } from './list-multa.component';

describe('ListMultaComponent', () => {
  let component: ListMultaComponent;
  let fixture: ComponentFixture<ListMultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
