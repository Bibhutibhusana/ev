import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdoComponent } from './ddo.component';

describe('DdoComponent', () => {
  let component: DdoComponent;
  let fixture: ComponentFixture<DdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
