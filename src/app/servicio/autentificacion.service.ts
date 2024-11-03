import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { arrayUnion } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: { uid: string; [key: string]: any } | null = null;
  private currentUserSubject = new BehaviorSubject<any>(null); 
  public defaultProfileImageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/appasistencia-f0092.appspot.com/o/generica2.png?alt=media';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    const userData = localStorage.getItem('user');
    this.currentUser = userData ? JSON.parse(userData) : null;
    this.currentUserSubject.next(this.currentUser);

    
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.currentUserSubject.next(this.currentUser); 
      } else {
        this.currentUser = null;
        localStorage.removeItem('user');
        this.currentUserSubject.next(null); 
      }
    });
  }

  
  get usuarioActual(): Observable<any> {
    return this.currentUserSubject.asObservable(); 
  }

  //Con esto se comprueba si está logeado o no
  
  isAuthenticated(): boolean {
    return this.currentUser !== null || localStorage.getItem('user') !== null;
  }

  
  async iniciarSesion(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (!uid) {
        throw new Error('No se pudo obtener el UID del usuario.');
      }

      const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();

      if (userDoc && userDoc.exists) {
        const userData = userDoc.data();
        this.currentUser = { uid, ...(userData ? userData : {}) };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.currentUserSubject.next(this.currentUser); 
        return true;
      } else {
        throw new Error('No se encontró el usuario en Firestore.');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  
  async registrarUsuario(email: string, password: string, extraData: any): Promise<boolean> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      if (userCredential.user) {
        const uid = userCredential.user.uid;
  
        
        const newUser = {
          email,
          img: extraData.img || this.defaultProfileImageUrl, 
          qrCode: email,
          attendance: extraData.attendance || [{
            clase: "",
            fecha: new Date(),
            email: email,
            img: extraData.img || this.defaultProfileImageUrl 
          }]
        };
  
        await this.firestore.collection('users').doc(uid).set(newUser);
  
        this.currentUser = { uid, ...newUser };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.currentUserSubject.next(this.currentUser); 
        return true;
      } else {
        throw new Error('Error al crear el usuario.');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  
  obtenerUsuarioAutenticado() {
    if (!this.currentUser) {
      const userData = localStorage.getItem('user');
      this.currentUser = userData ? JSON.parse(userData) : null;
      this.currentUserSubject.next(this.currentUser); 
    }
    return this.currentUser;
  }
  
  async registrarDatosQR(seccion: string, code: string, fecha: string, asistencia: boolean) {
    if (!this.currentUser) {
      console.warn('No hay usuario autenticado. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }
    try {
      const userDoc = await this.firestore.collection('users').doc(this.currentUser.uid).get().toPromise();
      const userData = userDoc?.data() as { qrRecords?: Array<{ seccion: string; code: string; fecha: string; asistencia: boolean }> } || {};
      const qrRecords = userData.qrRecords ?? [];
  
      const existeRegistro = qrRecords.some((record) => 
        record.seccion === seccion && record.code === code && record.fecha === fecha
      );
  
      if (existeRegistro) {
        console.log('Este registro ya existe. No se guardarán datos duplicados.');
        alert('Ya has registrado esta asistencia.');
      } else {
        const qrRecord = { seccion, code, fecha, asistencia };
        await this.firestore.collection('users').doc(this.currentUser.uid).update({
          qrRecords: arrayUnion(qrRecord)
        });
        console.log('Datos del QR registrados en Firestore:', qrRecord);
        alert('Datos registrados exitosamente');
      }
    } catch (error) {
      console.error('Error al registrar los datos del QR en Firestore:', error);
    }
  }

  async obtenerAsistencia(): Promise<Array<{ seccion: string; code: string; fecha: string; asistencia: boolean }>> {
    if (!this.currentUser) {
      console.warn('No hay usuario autenticado. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return [];
    }
  
    try {
      const userDoc = await this.firestore.collection('users').doc(this.currentUser.uid).get().toPromise();
      const userData = userDoc?.data() as { qrRecords?: Array<{ seccion: string; code: string; fecha: string; asistencia: boolean }> } || {};
      return userData.qrRecords || [];
    } catch (error) {
      console.error('Error al obtener los datos de asistencia:', error);
      return [];
    }
  }

  async enviarRecuperacionPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo de recuperación enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      throw new Error('No se pudo enviar el correo de recuperación. Verifica que el correo esté registrado.');
    }
  }

  
  async cerrarSesion(): Promise<void> {
    await this.afAuth.signOut();
    this.currentUser = null;
    localStorage.removeItem('user');
    this.currentUserSubject.next(null); 
    this.router.navigate(['/home']);
  }

  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso. Prueba con otro.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Prueba con una más segura.';
      case 'auth/user-not-found':
        return 'El usuario no existe. Verifica tus datos.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta. Inténtalo de nuevo.';
      default:
        return 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
}  
