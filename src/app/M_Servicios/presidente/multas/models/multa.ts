
export interface Multas {
    id_multa: number;
    id_usuario: number;
    valor_multa: number;
    observacion: string;
}

export interface Multa {
    id_multa: number;
    id_usuario: number;
    valor_multa: number;
    observacion: string;
    usuario: {
        persona: {
            nombre: string;
            apellido: string;
        },
        localidad: {
            nombre: string;
        }
    };
}