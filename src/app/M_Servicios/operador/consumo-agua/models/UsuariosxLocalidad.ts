
//Modelo de Usuarios por Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface UsuariosxLocalidad {
    resultados: ResultadoUxL[];
}
export interface ResultadoUxL {
    id_usuario:             number;
    id_responsable_lectura: number;
    id_usuario_rol:         number;
    id_localidad:           number;
    lectura_actual:         number;
    lectura_anterior:       number;
    consumo_total:          number;
    estado_resp:            number;
    estado_lectura:         number;
    id_estado_medidor:      number;
    codigo:                 string;
    nombre:                 string;
    apellido:               string;
    observaciones:          string;
    editadoPor:             string;
}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class UserxLoc {
    static userxLoc(obj: ResultadoUxL) {
        return new UserxLoc(
        obj ['id_usuario'],
        obj ['id_responsable_lectura'],
        obj ['id_estado_medidor'],
        obj ['codigo'],
        obj ['lectura_actual'],
        obj ['lectura_anterior'],
        obj ['consumo_total'],
        obj ['nombre'],
        obj ['apellido'],
        obj ['id_usuario_rol'],
        obj ['estado_resp'],
        obj ['id_localidad'],
        obj ['observaciones'],
        obj ['estado_lectura'],
        obj ['editadoPor'],

        );
    }

    constructor(
        public id_usuario:             number,
        public id_responsable_lectura: number,
        public id_estado_medidor:      number,
        public codigo:                 string,
        public lectura_actual:         number,
        public lectura_anterior:       number,
        public consumo_total:          number,
        public nombre:                 string,
        public apellido:               string,
        public id_usuario_rol:         number,
        public estado_resp:            number,
        public id_localidad:           number,
        public observaciones:          string,
        public estado_lectura:         number,
        public editadoPor:             string,
    ) {}
}