import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthService } from './autentificacion.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig), // Usa la configuración de Firebase
      ],
      providers: [
        { provide: AngularFireAuth, useValue: { authState: new BehaviorSubject(null) } }, // Mock de AngularFireAuth
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
