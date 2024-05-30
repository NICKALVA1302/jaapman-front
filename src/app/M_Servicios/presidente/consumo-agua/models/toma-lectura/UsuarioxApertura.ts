
//Modelo de Usuarios por Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface UsuarioxApertura {
    resultados: ResultadoUxA[];
}
export interface ResultadoUxA {
    id_apertura:            number;
    localidad:              string;
    codigo:                 string;
    nombre_categoria:       string;
    exedente:               number;
    id_estado_medidor:      number;
    lectura_anterior:       number;
    lectura_actual:         number;
    consumo_total:          number;
    observacion_presidente: string;
    estado_lectura:         number;
    editadoPor:             string;
    nombre_persona:         string;
    apellido_persona:       string;
    cedula:                 string;
    id_usuario:             number;
    nom_mes:                string;
    nom_anio:               string;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class ClassUserxApertura {
    static userxApertura(obj: ResultadoUxA) {
        return new ClassUserxApertura(
        obj ['id_apertura'],
        obj ['localidad'],
        obj ['codigo'],
        obj ['nombre_categoria'],
        obj ['exedente'],
        obj ['id_estado_medidor'],
        obj ['lectura_anterior'],
        obj ['lectura_actual'],
        obj ['consumo_total'],
        obj ['observacion_presidente'],
        obj ['estado_lectura'],
        obj ['editadoPor'],
        obj ['nombre_persona'],
        obj ['apellido_persona'],
        obj ['cedula'],
        obj ['id_usuario'],
        obj ['nom_mes'],
        obj ['nom_anio'],
        
        );
    }

    constructor(
        public id_apertura:            number,
        public localidad:              string,
        public codigo:                 string,
        public nombre_categoria:       string,
        public exedente:               number,
        public id_estado_medidor:      number,
        public lectura_anterior:       number,
        public lectura_actual:         number,
        public consumo_total:          number,
        public observacion_presidente: string,
        public estado_lectura:         number,
        public editadoPor:             string,
        public nombre_persona:         string,
        public apellido_persona:       string,
        public cedula:                 string,
        public id_usuario:             number,
        public nom_mes:                string,
        public nom_anio:               string,
    ) {}
}