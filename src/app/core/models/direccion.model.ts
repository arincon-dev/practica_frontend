import {Usuario} from "./user.model";

export interface Direccion {
    id: number;

    nombreCalle: string;

    numeroCalle: number;

    usuario: Usuario | null;

    direccionPrincipal: boolean;
}