import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { VerAsistenciaPage } from './ver-asistencia.page';
import { AuthService } from '../../servicio/autentificacion.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

describe('VerAsistenciaPage', () => {
  let component: VerAsistenciaPage;
  let fixture: ComponentFixture<VerAsistenciaPage>;

  beforeEach(async () => {
    const authServiceMock = {
      getAsistencia: jasmine.createSpy('getAsistencia').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [VerAsistenciaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AngularFireAuth, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
