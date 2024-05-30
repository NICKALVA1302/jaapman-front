
//Modelo de Usuarios por Localidad, para mapear los datos que vienen del servicio

//Interfaces
export interface UsuariosxLocalidad {
    resultados: ResultadoUxL[];
}
export interface ResultadoUxL {
    codigo:                 string;
    nombre_categoria:       string;
    exedente:               number;
    id_estado_medidor:      number;
    lectura_actual:         number;
    lectura_anterior:       number;
    consumo_total:          number;
    observaciones:          string;
    estado_lectura:         number;
    editadoPor:             string;
    nombre_persona:         string;
    apellido_persona:       string;
    cedula:                 string;
    id_usuario:             number;
    descripcion:            string;
    total_personas_localidad: number;


}

//Clases
//Se crea una clase para obtener unicamente los datos que se van a utilizar, y 
//asi mismo poner los mismos datos en el constructor
export class ClassUserxLoc {
    static userxLocal(obj: ResultadoUxL) {
        return new ClassUserxLoc(
        obj ['codigo'],
        obj ['nombre_categoria'],
        obj ['exedente'],
        obj ['id_estado_medidor'],
        obj ['lectura_actual'],
        obj ['lectura_anterior'],
        obj ['consumo_total'],
        obj ['observaciones'],
        obj ['estado_lectura'],
        obj ['editadoPor'],
        obj ['nombre_persona'],
        obj ['apellido_persona'],
        obj ['cedula'],
        obj ['id_usuario'],
        obj ['descripcion'],
        obj ['total_personas_localidad'],


        
        );
    }

    constructor(
        public codigo:                 string,
        public nombre_categoria:       string,
        public exedente:               number,
        public id_estado_medidor:      number,
        public lectura_actual:         number,
        public lectura_anterior:       number,
        public consumo_total:          number,
        public observaciones:          string,
        public estado_lectura:         number,
        public editadoPor:             string,
        public nombre_persona:         string,
        public apellido_persona:       string,
        public cedula:                 string,
        public id_usuario:             number,
        public descripcion:            string,
        public total_personas_localidad: number,
        
        
    ) {}
}