import {Genero} from "./genero.model";
import {PuestoDeTrabajo} from "./puestodetrabajo.model";
import {Direccion} from "./direccion.model";

export interface Usuario {
  id: number | null;
  nickUsuario: string | null;
  nombre: string | null;
  contrasena: string | null;
  fechaHoraCreacion: Date;
  genero: Genero;
  primerApellido: string | null;
  segundoApellido: string | null;
  fechaNacimiento: Date | string | null;
  horaDesayuno: string | null;
  puestoTrabajo: PuestoDeTrabajo;
  admin: boolean;
  direcciones: Direccion[] | null;
}

export const usuarioInicial: Usuario = {
  id: null,
  nickUsuario: null,
  nombre: null,
  contrasena: null,
  fechaHoraCreacion: new Date(),
  genero: {
    id: null,
    nombre: null
  },
  primerApellido: null,
  segundoApellido: null,
  fechaNacimiento: null,
  horaDesayuno: null,
  puestoTrabajo: {
    id: null,
    nombre: null
  },
  admin: false,
  direcciones: null
};
