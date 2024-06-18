export interface Localidad {
  id_localidad: string | number;
  id_estado: number;
  nombre: string;
  descripcion: string;
}

export interface DeudaUsuario {
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  deuda_pendiente: number;
  total_deuda: number;
}
