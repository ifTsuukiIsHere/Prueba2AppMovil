import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from 'capacitor-barcode-scanner';
import { AuthService } from 'src/app/servicio/autentificacion.service';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQrPage implements OnInit {
  textoescaneado: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  async escanear() {
    try {
      // Escanear el código QR
      const scanResultado = await BarcodeScanner.scan();
      console.log('Resultado del escaneo:', scanResultado);

      // Verificar si el QR tiene un código válido
      if (scanResultado.result && scanResultado.code) {
        console.log('Contenido del QR escaneado:', scanResultado.code);

        try {
          // Intentar procesar el contenido como JSON
          const datosQR = JSON.parse(scanResultado.code);
          console.log('Datos procesados del QR:', datosQR);

          // Validar las claves del QR
          if (
            typeof datosQR.seccion === 'string' &&
            typeof datosQR.code === 'string' &&
            typeof datosQR.fecha === 'string' &&
            typeof datosQR.asistencia === 'boolean'
          ) {
            console.log('Formato correcto del QR:', datosQR);

            // Almacenar el texto escaneado
            this.textoescaneado = JSON.stringify(datosQR);

            // Registrar los datos del QR en Firestore
            await this.authService.registrarDatosQR(
              datosQR.seccion,
              datosQR.code,
              datosQR.fecha,
              datosQR.asistencia
            );

            alert('QR escaneado y datos registrados exitosamente.');
          } else {
            alert('El QR no contiene los datos necesarios.');
          }
        } catch (error) {
          console.error('Error al procesar el QR:', error);
          alert('El QR no contiene datos válidos.');
        }
      } else {
        alert('No se detectó ningún código QR.');
      }
    } catch (error) {
      console.error('Error durante el escaneo:', error);
      alert('Error al escanear el QR. Inténtalo nuevamente.');
    }
  }
}