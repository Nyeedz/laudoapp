import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EnvironmentComponent } from './environment.component';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [EnvironmentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
