import { async, ComponentFixture, TestBed } from '@app/environment-item/node_modules/@angular/core/testing';

import { EnvironmentItemComponent } from './environment-item.component';

describe('EnvironmentItemComponent', () => {
  let component: EnvironmentItemComponent;
  let fixture: ComponentFixture<EnvironmentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
