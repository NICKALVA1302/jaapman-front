
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface Localidad {
    resultados: ResultadoL[];
}

export interface ResultadoL {
    id_localidad:   number;
    nombre:         string;
    total_personas: number;
    id_usuario_rol: number;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class NombreLoc {
    static locxNumUser(obj: ResultadoL) {
        return new NombreLoc(
        obj['id_localidad'],
        obj['nombre'],
        obj['total_personas'],
        obj['id_usuario_rol']
        
        );
    }

    constructor(
        public id_localidad: number,
        public nombre: string,
        public total_personas: number,
        public id_usuario_rol: number,
        
    ) {}
}