import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../../environments/environment';
import { PassRecoveryPage } from './pass-recovery.page';
import { BehaviorSubject } from 'rxjs';


describe('PassRecoveryPage', () => {
  let component: PassRecoveryPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AngularFireAuth, useValue: { authState: new BehaviorSubject(null) } }, // Mock de AngularFireAuth
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PassRecoveryPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
