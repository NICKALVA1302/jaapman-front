export interface Usuxlocalidad {
    id_usuario: number;
    id_persona: number;
    id_localidad: number;
    id_medidor: number | null;
    id_estado: number;
    id_login: number;
    persona: {
      nombre: string;
      apellido: string;
      cedula: string;
    };
    localidad: {
      id_localidad: number;
      nombre: string;
    };
    isChecked?: boolean;
  }

  