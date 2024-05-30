
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface Operadores {
    resultados: ResultadoOp[];
}

export interface ResultadoOp {
    id_usuario_rol:   number;
    fullname:         string;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class NombreOperadors {
    static operadores(obj: ResultadoOp) {
        return new NombreOperadors(
        obj['id_usuario_rol'],
        obj['fullname'],
        
        );
    }

    constructor(
        public id_usuario_rol: number,
        public fullname: string,
        
    ) {}
}