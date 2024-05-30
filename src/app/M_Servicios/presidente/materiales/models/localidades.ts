import { Material } from "./material";

export interface Localidad {
    id_localidad: string | number;
    id_estado: number;
    nombre: string;
    descripcion: string;
  }

  export interface DatosPorLocalidad {
    id_persona: number;
    nombre: string;
    apellido: string;
    cedula: string;
    direccion: string;
    usuarios: {
      id_usuario: number;
      id_persona: number;
      id_localidad: number;
      id_medidor: number;
      id_estado: number;
      id_login: number;
      localidad: {
        nombre: string;
      };
      medidor: {
        id_medidor: number;
        codigo: string;
      };
    }[];
  }

  
export interface UsuarioxLocalidad {
  id_usuario: number;
  id_persona: number;
  id_localidad: number;
  id_medidor: number | null;
  id_estado: number;
  id_login: number;
  createdAt: Date;
  updatedAt: Date;
  persona: {
    nombre: string;
    apellido: string;
    cedula: string;
    direccion: string;
  };
  localidad: {
    id_localidad: number;
    nombre: string;
  };
  Mantenimientos: Mantenimiento[]; // Define esta parte según la estructura de tu Mantenimiento
  medidor: {
    codigo: string;
  };
}

export interface Mantenimiento {
  total: number;
  mantenimiento_detalles: MantenimientoDetalle[];
  Tarifa: {
    valor: number;
  };
  Estado_pago: {
    nombre: string;
  };
}

export interface MantenimientoDetalle {
  cantidad: number;
  subtotal: number;
  material: Material; // Aquí puedes referenciar la interfaz Material si la tienes definida
}


//   export interface UsuarioxLocalidad {
//     id_persona: number;
//     nombre: string;
//     apellido: string;
//     cedula: string;
//     direccion: string;
//     usuarios: {
//         id_usuario: number;
//         id_persona: number;
//         id_localidad: number;
//         id_medidor: number | null;
//         id_estado: number;
//         id_login: number;
//         localidad: {
//             nombre: string;
//         };
//         mantenimientos: {
//             id_mantenimiento: number;
//             total: number;
//             detalle_mantenimientos: {
//                 cantidad: number;
//                 subtotal: number;
//                 material: {
//                     nombre: string;
//                     precio: number;
//                 };
//             }[];
//             tarifa: {
//                 valor: number;
//             };
//             estado_pago: {
//                 nombre: string;
//             };
//         }[];
//         medidor: {
//             codigoMedidor: string;
//         } | null;
//     }[];
// }