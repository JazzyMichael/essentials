import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostViewPage } from './post-view.page';

describe('PostViewPage', () => {
  let component: PostViewPage;
  let fixture: ComponentFixture<PostViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
