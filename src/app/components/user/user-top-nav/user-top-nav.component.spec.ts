import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTopNavComponent } from './user-top-nav.component';

describe('UserTopNavComponent', () => {
  let component: UserTopNavComponent;
  let fixture: ComponentFixture<UserTopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTopNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
