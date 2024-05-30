import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRepListCliComponent } from './view-rep-list-cli.component';

describe('ViewRepListCliComponent', () => {
  let component: ViewRepListCliComponent;
  let fixture: ComponentFixture<ViewRepListCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRepListCliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRepListCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
