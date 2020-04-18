import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserPostsPage } from './user-posts.page';

describe('UserPostsPage', () => {
  let component: UserPostsPage;
  let fixture: ComponentFixture<UserPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPostsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
