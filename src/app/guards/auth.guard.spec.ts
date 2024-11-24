import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../servicio/autentificacion.service';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      usuarioActual: new BehaviorSubject(null), // Simula el usuario actual
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should block access and redirect when user is not authenticated', () => {
    // Emitir `null` para simular que no hay un usuario autenticado
    authServiceMock.usuarioActual.next(null);

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = guard.canActivate(mockRoute, mockState);

    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBeFalse(); // El acceso debe ser bloqueado
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: undefined },
        });
      });
    } else {
      expect(result).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: undefined },
      });
    }
  });

  it('should allow access when user is authenticated', () => {
    // Emitir un objeto para simular un usuario autenticado
    authServiceMock.usuarioActual.next({ id: '123' });

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = guard.canActivate(mockRoute, mockState);

    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBeTrue(); // El acceso debe ser permitido
      });
    } else {
      expect(result).toBeTrue();
    }
  });
});
