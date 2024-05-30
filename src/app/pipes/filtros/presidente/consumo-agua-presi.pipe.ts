import { Pipe, PipeTransform } from '@angular/core';
import { ClassUserxLoc } from '../../../M_Servicios/presidente/consumo-agua/models';

@Pipe({
  name: 'consumoAguaPresi'
})
export class ConsumoAguaPresiPipe implements PipeTransform {
  transform(array: ClassUserxLoc[], campoOrdenamiento: string = 'nombre', ordenamiento: string = 'asc'): ClassUserxLoc[] {
    if (!Array.isArray(array) || array.length <= 1) {
        return array;
    }

    return array.sort((a, b) => {
        const valueA = (campoOrdenamiento === 'nombre') ? a.nombre_persona.toUpperCase() : a.apellido_persona.toUpperCase();
        const valueB = (campoOrdenamiento === 'nombre') ? b.nombre_persona.toUpperCase() : b.apellido_persona.toUpperCase();

        if (ordenamiento === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
    });
}

}
