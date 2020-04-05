import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntroSlidesPage } from './intro-slides.page';

describe('IntroSlidesPage', () => {
  let component: IntroSlidesPage;
  let fixture: ComponentFixture<IntroSlidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroSlidesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroSlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
