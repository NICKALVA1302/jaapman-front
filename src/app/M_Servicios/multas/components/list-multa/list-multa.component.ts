import { Component, OnInit } from '@angular/core';
import { MultasService } from '../../services/multas.service';
import { Multa } from '../../models/multa';

@Component({
  selector: 'app-list-multa',
  templateUrl: './list-multa.component.html',
  styleUrls: ['./list-multa.component.css']
})
export class ListMultaComponent implements OnInit {

  multas: Multa[] = [];

  constructor(private multasService: MultasService) { }

  ngOnInit(): void {
    this.obtenerListadoMultas();
  }

  obtenerListadoMultas(): void {
    this.multasService.obtenerListadoMultas().subscribe(
      (data: Multa[]) => {
        console.log('Listado de multas:', data); // Agrega este console.log
        this.multas = data;
      },
      error => {
        console.error('Error al obtener el listado de multas:', error);
      }
    );
  }
}
