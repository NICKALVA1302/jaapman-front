
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface Localidad {
    resultados: ResultadoL[];
}

export interface ResultadoL {
    id_localidad:   number;
    nombre:         string;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class NombreLoc {
    static localidades(obj: ResultadoL) {
        return new NombreLoc(
        obj['id_localidad'],
        obj['nombre'],
        
        );
    }

    constructor(
        public id_localidad: number,
        public nombre: string,
        
    ) {}
}