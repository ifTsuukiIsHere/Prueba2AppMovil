import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicio/autentificacion.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of(true)),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AngularFireAuth, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
