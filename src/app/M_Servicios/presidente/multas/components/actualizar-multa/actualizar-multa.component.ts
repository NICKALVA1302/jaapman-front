import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { MultasService } from '../../services/multas.service';
import { Multa } from '../../models/multa';


@Component({
  selector: 'app-actualizar-multa',
  templateUrl: './actualizar-multa.component.html',
  styleUrl: './actualizar-multa.component.css'
})
export class ActualizarMultaComponent {

  id_multa: number;
  multa: Multa = {
    id_multa: 0,
    id_usuario: 0,
    valor_multa: 0,
    observacion: '',
    usuario: {
      persona: {
        nombre: '',
        apellido: ''
      },
      localidad: {
        nombre: ''
      }
    }
  };

  loading: boolean = false;

  constructor(
    private multasService: MultasService,
    private toastr: ToastrService,
    private router: Router,
    private aRouter: ActivatedRoute
  ) {
    this.id_multa = Number(aRouter.snapshot.paramMap.get('id_multa'));
    console.log(this.id_multa);
  }

  ngOnInit(): void {
    this.multa.id_multa = this.id_multa;
    this.obtenerMultaXId(this.id_multa);
  }

  obtenerMultaXId(id_multa: number) {
    this.multasService.obtenerMultaXId(id_multa).subscribe((data: Multa) => {
      this.multa = data;
      console.log(data);
    },
      error => {
        console.error('Error al obtener la multa por ID:', error);
        this.toastr.error('Error al obtener la multa', 'Error');
      }
    );
  }

  actualizarMulta(): void {
    this.loading = true;
  
    // Verificar si se ingresó un valor válido para valor_multa
    if (this.multa.valor_multa <= 0 || isNaN(this.multa.valor_multa)) {
      this.toastr.warning('Ingrese un valor de multa válido (mayor a cero)', 'Advertencia');
      this.loading = false;
      return;
    }
  
    // Verificar si se ingresó un valor válido para observacion
    if (!this.multa.observacion.trim()) {
      this.toastr.warning('Ingrese una observación', 'Advertencia');
      this.loading = false;
      return;
    }
  
    // Si ambos campos tienen valores válidos, proceder con la actualización
    this.multasService.actualizarMulta(this.id_multa, this.multa.valor_multa, this.multa.observacion).subscribe(
      () => {
        this.toastr.success('Multa actualizada correctamente', 'Éxito');
        this.loading = false;
        this.router.navigate(['/presidente/listMulta']);
      },
      error => {
        console.error('Error al actualizar la multa:', error);
        this.toastr.error('Error al actualizar la multa', 'Error');
        this.loading = false;
      }
    );
  }
}