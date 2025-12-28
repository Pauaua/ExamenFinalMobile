import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityCreatePage } from './activity-create.page';

describe('ActivityCreatePage', () => {
  let component: ActivityCreatePage;
  let fixture: ComponentFixture<ActivityCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
