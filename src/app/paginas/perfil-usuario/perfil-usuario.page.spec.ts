import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importa el esquema
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { environment } from '../../../environments/environment';
import { PerfilUsuarioPage } from './perfil-usuario.page';
import { BehaviorSubject } from 'rxjs';

describe('PerfilUsuarioPage', () => {
  let component: PerfilUsuarioPage;

  beforeEach(() => {
    const angularFirestoreMock = {
      collection: jasmine.createSpy('collection').and.returnValue({
        doc: jasmine.createSpy('doc').and.returnValue({
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ data: () => ({}) })),
          update: jasmine.createSpy('update'),
        }),
      }),
    };

    TestBed.configureTestingModule({
      declarations: [PerfilUsuarioPage],
      imports: [
        IonicModule.forRoot(), // Asegúrate de importar IonicModule
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: AngularFireAuth, useValue: { authState: new BehaviorSubject(null) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite el uso de elementos personalizados como `ion-*`
    }).compileComponents();

    const fixture = TestBed.createComponent(PerfilUsuarioPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
