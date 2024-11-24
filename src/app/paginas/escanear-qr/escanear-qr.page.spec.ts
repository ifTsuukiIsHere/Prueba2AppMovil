import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EscanearQrPage } from './escanear-qr.page';
import { AuthService } from '../../servicio/autentificacion.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs'; // Importa 'of' correctamente

describe('EscanearQrPage', () => {
  let component: EscanearQrPage;
  let fixture: ComponentFixture<EscanearQrPage>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['someAuthMethod'], {
      usuarioActual: of(null), // Utiliza correctamente 'of' importado
    });

    await TestBed.configureTestingModule({
      declarations: [EscanearQrPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AngularFireAuth, useValue: jasmine.createSpyObj('AngularFireAuth', ['signInWithEmailAndPassword']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EscanearQrPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Agrega más pruebas si es necesario
});
