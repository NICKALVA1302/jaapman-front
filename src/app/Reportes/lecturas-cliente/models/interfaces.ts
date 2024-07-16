export interface Anio {
  id_anio: string | number;
  id_estado: number | number;
  descripcion: string;
}

export interface LecturaUser {
  PersonaCedula: string;
  PersonaNombre: string;
  PersonaApellido: string;
  PersonaDireccion: string;
  PersonaTelefono: string;

  Mes: string;
  Año: string;
  Anterior: string;
  Actual: string;
  Consumo: string;
  Estado: string;
  Abono: string;
  COM: string;
  Valor: string;
  Saldo: string;
}
