
//Modelo de Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface OperadoresAsig {
    resultados: ResultadoOpA[];
}

export interface ResultadoOpA {
    id_rol:                 number;
    id_usuario_rol:         number;
    id_responsable_lectura: number;
    id_usuario:             number;
    id_localidad:           number;
    fullname:               string;
    localidad:              string;
    telefono:               string;
    cedula:                 string;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class OperadorsAsig {
    static operadoresAsig(obj: ResultadoOpA) {
        return new OperadorsAsig(
        obj['id_rol'],
        obj['id_usuario_rol'],
        obj['id_responsable_lectura'],
        obj['id_usuario'],
        obj['id_localidad'],
        obj['fullname'],
        obj['localidad'],
        obj['telefono'],
        obj['cedula'],
        
        );
    }

    constructor(
        public id_rol:                  number,
        public id_usuario_rol:          number,
        public id_responsable_lectura:  number,
        public id_usuario:              number,
        public id_localidad:            number,
        public fullname:                string,
        public localidad:               string,
        public telefono:                string,
        public cedula:                  string,
        
    ) {}
}