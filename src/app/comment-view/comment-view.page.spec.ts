import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommentViewPage } from './comment-view.page';

describe('CommentViewPage', () => {
  let component: CommentViewPage;
  let fixture: ComponentFixture<CommentViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
