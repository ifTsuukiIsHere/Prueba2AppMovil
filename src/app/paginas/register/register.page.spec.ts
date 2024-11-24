import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RegisterPage } from './register.page';
import { AuthService } from '../../servicio/autentificacion.service';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    authServiceMock.register.and.returnValue(of(true)); // Mocking register method

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // To handle Ionic components
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests for register logic
});
