import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPrintComponent } from './bill-print.component';

describe('BillPrintComponent', () => {
  let component: BillPrintComponent;
  let fixture: ComponentFixture<BillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillPrintComponent]
    });
    fixture = TestBed.createComponent(BillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
