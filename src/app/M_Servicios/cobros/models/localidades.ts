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
      planillas: {
        total_pagar: number;
        PlanillaDetalles: {
            id_planilla_det: number;
            total_pago: number;
            Alcantarillado: {
                id_tarifa: number;
                Tarifa: {
                    valor: number;
                };
            } | null;
            Mantenimiento: {
                total: number;
            } | null;
            Instalacion: {
                valor: number;
            } | null;
        }[];
    }[];
}[];
}

  export interface TipoPago {
    id_tipopago:  number;
    id_estado: number;
    nombre: string;
  }