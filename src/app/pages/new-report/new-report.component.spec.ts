import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NewReportComponent } from './new-report.component';

describe('NewReportComponent', () => {
  let component: NewReportComponent;
  let fixture: ComponentFixture<NewReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [NewReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
