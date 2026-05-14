import {Usuario} from "./user.model";

export interface Direccion {
    id: number | null;

    nombreCalle: string;

    numeroCalle: number | null;

    usuario: Usuario | null;

    direccionPrincipal: boolean;
}