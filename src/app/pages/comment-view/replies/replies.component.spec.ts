import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepliesComponent } from './replies.component';

describe('RepliesComponent', () => {
  let component: RepliesComponent;
  let fixture: ComponentFixture<RepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepliesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
