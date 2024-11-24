import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicio/autentificacion.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage {
  archivo: File | null = null; // Archivo seleccionado
  previewUrl: string | null = null; // URL de vista previa de la imagen seleccionada
  imagenes: string[] = []; // Lista de imágenes disponibles (puedes omitir si no la usas)
  imagenSeleccionada: string = ''; // Imagen seleccionada para subir

  constructor(private authService: AuthService, private alertController: AlertController) {}

  // Manejar la selección de archivo
  seleccionarArchivo(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        this.archivo = file;

        // Crear una URL de vista previa
        this.previewUrl = URL.createObjectURL(file);
      } else {
        this.mostrarAlerta('Por favor, selecciona un archivo de imagen válido.');
        this.archivo = null;
        this.previewUrl = null;
      }
    }
  }

  // Método para subir la imagen seleccionada
  async subirImagen() {
    if (!this.archivo) {
      this.mostrarAlerta('Por favor, selecciona un archivo para subir.');
      return;
    }

    try {
      const url = await this.authService.subirImagen(this.archivo);
      this.imagenSeleccionada = url; // Actualiza la selección con la nueva imagen subida
      this.previewUrl = null; // Limpia la vista previa después de subir
      this.mostrarAlerta('Imagen subida con éxito.');
    } catch (error) {
      this.mostrarAlerta('Error al subir la imagen.');
    }
  }

  // Método para guardar la imagen seleccionada como imagen de perfil
  async guardarImagen() {
    if (!this.imagenSeleccionada) {
      this.mostrarAlerta('Por favor, selecciona una imagen.');
      return;
    }

    try {
      await this.authService.actualizarImagenPerfil(this.imagenSeleccionada);
      this.mostrarAlerta('Imagen de perfil actualizada con éxito.');
    } catch (error) {
      this.mostrarAlerta('Error al actualizar la imagen de perfil.');
    }
  }

  // Mostrar una alerta
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      message: mensaje,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  // Método para abrir el selector de archivos
  abrirSelectorDeArchivo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
