export interface Alcantarillado {
    id_alcantarillado: number;
    id_usuario: number;
    id_estado: number;
    id_tarifa: number;
    id_estado_pago: number;
    id_estado_al: number;
}

export interface Usuaxlocalidad {
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
    alcantarillado: Alcantarillado[];
    id_estado_al: number; // Debe ser number para manejar correctamente el estado
    isChecked?: boolean; // Para manejar el estado de la casilla de verificación
}