// consumo-agua2.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { UserxLoc } from '../../M_Servicios/operador/consumo-agua/models/UsuariosxLocalidad';

@Pipe({
    name: 'consumoAgua2',
})
export class ConsumoAgua2Pipe implements PipeTransform {
    transform(array: UserxLoc[], campoOrdenamiento: string = 'nombre', ordenamiento: string = 'asc'): UserxLoc[] {
        if (!Array.isArray(array) || array.length <= 1) {
            return array;
        }

        return array.sort((a, b) => {
            const valueA = (campoOrdenamiento === 'nombre') ? a.nombre.toUpperCase() : a.apellido.toUpperCase();
            const valueB = (campoOrdenamiento === 'nombre') ? b.nombre.toUpperCase() : b.apellido.toUpperCase();

            if (ordenamiento === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
    }
}
