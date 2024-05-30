import { Component, OnInit } from '@angular/core';
import { ConsumoAguaService } from '../../services/consumo-agua.service';

@Component({
  selector: 'app-menu-operador',
  templateUrl: './menu-operador.component.html',
  styleUrl: './menu-operador.component.css'
})
export class MenuOperadorComponent implements OnInit{
  full_name: string='';

  constructor(private localidadServices:ConsumoAguaService){}

  ngOnInit(): void {
    this.obtenerFullname();
    this.localidadServices.init();
  }

  obtenerFullname(){
    const fullName = localStorage.getItem('fullname');
    if (!fullName) {
      const id_user_rol:any = localStorage.getItem('id_usuario_rol');
      this.localidadServices.obtenerNombreUserRol(id_user_rol).subscribe((resultado) =>{
        const fullname = this.full_name = resultado[0].fullname
        localStorage.setItem('fullname', fullname);
      })
      
    }else{
      const nombreUser:any = localStorage.getItem('fullname');
        this.full_name = nombreUser;
      
    }
    
  }
  
  
}
