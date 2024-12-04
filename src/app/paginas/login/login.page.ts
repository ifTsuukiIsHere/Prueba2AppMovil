import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicio/autentificacion.service';
import { Plugins } from '@capacitor/core';

const { BiometricAuth } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  authenticating: boolean = false; 
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Verificar si el usuario tiene credenciales vinculadas para autenticación biométrica
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      try {
        const creds = await this.authService.obtenerCredencialesBiometricas(currentUser.uid);
        if (creds) {
          this.iniciarSesionBiometrica(creds.email, creds.password);
        }
      } catch (error) {
        console.error('No se pudieron recuperar las credenciales biométricas:', error);
      }
    }
  }

  async iniciarSesionBiometrica(email: string, password: string) {
    try {
      const result = await BiometricAuth['authenticate']({
        reason: 'Usa tu huella digital para iniciar sesión automáticamente',
      });

      if (result.verified) {
        const confirmacion = await this.authService.iniciarSesion(email, password);
        if (confirmacion) {
          this.router.navigate(['/perfil-usuario']);
        } else {
          alert('Credenciales incorrectas almacenadas.');
        }
      } else {
        console.error('Autenticación biométrica fallida');
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      alert('No se pudo realizar la autenticación biométrica.');
    }
  }

  async onLogin() {
    try {
      const confirmacion = await this.authService.iniciarSesion(this.email, this.password);
      if (confirmacion) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          await this.authService.guardarCredencialesBiometricas(
            currentUser.uid,
            this.email,
            this.password
          );
        }
        this.router.navigate(['/perfil-usuario']);
      } else {
        alert('Credenciales incorrectas, por favor intenta de nuevo.');
      }
    } catch (error: any) {
      alert(error.message);
      console.error('Error al intentar iniciar sesión:', error);
    }
  }
}
