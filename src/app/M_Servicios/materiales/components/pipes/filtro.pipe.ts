import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(value: any, args: any): any {

    //Almacenas la busqueda
    const resultadoMaterial = [];

    //Validad que el nombre que buscas este con el campo de la lista
    for(const item of value){
      
      //Iguala el campo de busqueda con la palabra que introduces se agrego toLowerCase para que se transforme en minuscula
      if (item.nombre.toLowerCase().indexOf(args.toLowerCase()) > -1){
        resultadoMaterial.push(item);
      };
    };
    return resultadoMaterial;
  }

}
