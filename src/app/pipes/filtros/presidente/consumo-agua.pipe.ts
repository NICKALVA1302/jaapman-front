import { Pipe, PipeTransform } from '@angular/core';
import { ClassUserxLoc } from '../../../M_Servicios/presidente/consumo-agua/models';

@Pipe({
  name: 'consumoAgua'
})
export class ConsumoAguaPipe implements PipeTransform {

  transform(value: ClassUserxLoc[], buscarUsuario: string, estadoLectura: number, estadoMedidor: number): ClassUserxLoc[] {
    // El buscador solo funcionará si se tiene al menos 3 letras y no es vacío (es decir debe contener texto)
    // También se filtra si el estado de lectura fue realizado o no (1 realizado, 2 no realizado, 0 todos)
    if (!Array.isArray(value) || !buscarUsuario || buscarUsuario.length < 3) {
      if (estadoLectura === 1) {
        // Filtrar usuarios con estado de lectura igual a 1
        return value.filter(usuario => usuario.estado_lectura === 1);
      } else if (estadoLectura === 2) {
        // Excluir usuarios con estado de medidor 2 y 3, pero que sí tengan el estado de lectura 2
        return value.filter(usuario => usuario.id_estado_medidor !== 2 && usuario.id_estado_medidor !== 3 && usuario.estado_lectura === 2);
      } else if (estadoMedidor === 2 && estadoLectura === 0) { 
        // Filtrar usuarios con estado de medidor igual a 2
        return value.filter(usuario => usuario.id_estado_medidor === 2);
      } else if (estadoMedidor === 3 && estadoLectura === 0) {
        // Filtrar usuarios con estado de medidor igual a 3
        return value.filter(usuario => usuario.id_estado_medidor === 3);
      } else {
        // No se aplican filtros
        return value;
      }
    }
    
    // Se convierte el texto a minúsculas y se eliminan los espacios
    buscarUsuario = buscarUsuario.toLowerCase().trim();
    // Variables para concatenar el nombre y apellido
    const nombreApellidoConcat = (usuario: ClassUserxLoc) => (usuario.nombre_persona.toLowerCase() + ' ' + usuario.apellido_persona.toLowerCase());
    const apellidoNombreConcat = (usuario: ClassUserxLoc) => (usuario.apellido_persona.toLowerCase() + ' ' + usuario.nombre_persona.toLowerCase());

    // Se busca por nombre y apellido y viceversa, o también por código
    // Además, se tiene en cuenta el estado de medidor relacionado con el usuario buscado
    const resultados = value.filter((usuario: ClassUserxLoc) =>
      (nombreApellidoConcat(usuario).includes(buscarUsuario) || 
      apellidoNombreConcat(usuario).includes(buscarUsuario) || 
      usuario.cedula.toLowerCase().includes(buscarUsuario)) &&
      (estadoMedidor === 0 || usuario.id_estado_medidor === estadoMedidor) &&
      (estadoLectura === 0 || usuario.estado_lectura === estadoLectura && usuario.id_estado_medidor !== 2 && usuario.id_estado_medidor !== 3)
    );
    
    // Retorna los resultados
    return resultados;
  }

}