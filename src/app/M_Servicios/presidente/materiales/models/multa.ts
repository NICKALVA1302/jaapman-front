
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

// interface Persona {
//     id_persona: number;
//     nombre: string;
//     apellido: string;
//     cedula: string;
//     direccion: string;
//     usuario: Usuario;
//     localidad: Localidad;
// }

// interface Usuario {
//     id_usuario: number;
//     id_localidad: number;
//     id_medidor: number;
//     id_estado: number;
//     id_login: number;
//     createdAt: string;
//     updatedAt: string;
// }

// interface Localidad {
//     nombre: string;
// }