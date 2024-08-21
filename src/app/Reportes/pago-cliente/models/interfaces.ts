export interface PagoCliente {
  PersonaCedula: string;
  PersonaNombre: string;
  PersonaApellido: string;
  PersonaDireccion: string;
  PersonaTelefono: string;

  Fecha: string;
  Total: number;
  Tipo: string;
  Abono: number;
  Deuda: number;
  Descripcion: string;
  Estado: string;
}
