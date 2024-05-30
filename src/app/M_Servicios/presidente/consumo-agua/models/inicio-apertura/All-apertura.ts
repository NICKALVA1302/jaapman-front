
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface AllApertura {
    resultados: ResultadoAA[];
}


export interface ResultadoAA {
    id_apertura:        number;
    id_estado_apertura: number;
    id_anio:            number;
    id_mes:             number;
    fecha:              string;
    fecha_fin:          string;
    mes:                string;
    anio:               string;
    num_personas:       number;
    estado_apertura:    string;

}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class ClassAllApertura {
    static allApertura(obj: ResultadoAA) {
        return new ClassAllApertura(
        obj['id_apertura'],
        obj['id_estado_apertura'],
        obj['id_anio'],
        obj['id_mes'],
        obj['fecha'],
        obj['fecha_fin'],
        obj['mes'],
        obj['anio'],
        obj['num_personas'],
        obj['estado_apertura'],
        
        );
    }

    constructor(
        public id_apertura:        number,
        public id_estado_apertura: number,
        public id_anio:            number,
        public id_mes:             number,
        public fecha:              string,
        public fecha_fin:          string,
        public mes:                string,
        public anio:               string,
        public num_personas:       number,
        public estado_apertura:    string,
        
    ) {}
}