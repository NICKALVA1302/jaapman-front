export interface MantenimeintoDetalle {
    id_mantenimeinto_detalle: number;
    id_mantenimiento: number;
    id_material: number;
    cantidad: number;
    subtotal: number

}

export interface Mantenimeinto {
    id_mantenimiento: number;
    id_usuario: number;
    id_tarifa: number;
    total: number;
}


export interface Tarifa {
    id_tarifa: number;
    rango: number;
    valor: number;
}