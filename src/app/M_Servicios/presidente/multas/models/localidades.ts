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
      createdAt: string;
      updatedAt: string;
      localidad: {
        nombre: string;
      };
      medidor: {
        id_medidor: number;
        codigo: string;
      };
    }[];
  }