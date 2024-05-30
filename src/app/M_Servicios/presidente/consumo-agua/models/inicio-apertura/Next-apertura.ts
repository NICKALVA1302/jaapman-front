
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface NextApertura {
    resultados: ResultadoNA[];
}

export interface ResultadoNA {
    nombre_mes: string;
    anio:       string;
    id_mes:     number;
    id_anio:    number;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class ClassNextApertura {
    static nextApertura(obj: ResultadoNA) {
        return new ClassNextApertura(
        obj['nombre_mes'],
        obj['anio'],
        obj['id_mes'],
        obj['id_anio'],
        
        );
    }

    constructor(
        public nombre_mes: string,
        public anio: string,
        public id_mes: number,
        public id_anio: number,
        
    ) {}
}