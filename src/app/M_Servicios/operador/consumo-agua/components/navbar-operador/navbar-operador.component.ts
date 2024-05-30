import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-operador',
  templateUrl: './navbar-operador.component.html',
  styleUrl: './navbar-operador.component.css'
})
export class NavbarOperadorComponent {
  loading: boolean = false;
  

  constructor(private router: Router) { }
  //Función para cerrar sesion al usuario
  cerrarSesion() {
    this.loading = true;
    // Simula un retraso antes de redirigir al usuario a login
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/acceso/login']);
    }, 1000); 
  }

}
