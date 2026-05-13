import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Usuario } from '../models/user.model';
import to from "./utils.service";
import ConstUrls from "../../shared/contants/const-urls";
import { obtenerUsuarioLogado } from './utils.service';
import { Direccion } from '../models/direccion.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  private mapBackendUser(user: any): Usuario {
    return {
      id: user?.id ?? null,
      nickUsuario: user?.username ?? null,
      nombre: user?.name ?? null,
      contrasena: user?.password ?? null,
      fechaHoraCreacion: user?.createdAt ? new Date(user.createdAt) : new Date(),
      genero: {
        id: user?.gender?.id ?? null,
        nombre: user?.gender?.name ?? null
      },
      primerApellido: user?.firstSurname ?? null,
      segundoApellido: user?.secondSurname ?? null,
      fechaNacimiento: user?.birthDate ? new Date(user.birthDate) : null,
      horaDesayuno: user?.breakfastTime ?? null,
      puestoTrabajo: {
        id: user?.jobTitle?.id ?? null,
        nombre: user?.jobTitle?.name ?? null
      },
      admin: user?.isAdmin ?? false,
      direcciones: []
    };
  }

  private mapBackendAddress(address: any): Direccion {
    return {
      id: address?.id ?? null,
      nombreCalle: address?.streetName ?? null,
      numeroCalle: address?.streetNumber ?? null,
      usuario: null,
      direccionPrincipal: address?.mainAddress ?? false
    };
  }

  private toAddressRequestDto(userId: number, direccion: Direccion) {
    return {
      streetName: direccion.nombreCalle,
      streetNumber: direccion.numeroCalle,
      mainAddress: direccion.direccionPrincipal,
      userId
    };
  }

  async obtenerDireccionesUsuario(userId: number | null) {
    if (!userId) {
      return [];
    }

    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const response = await to(
      this.http
        .get(`${ConstUrls.API_URL}/api/v1/direcciones/usuario/${userId}`, { params, observe: 'response' })
        .toPromise()
    );

    if (Array.isArray(response)) {
      return [];
    }

    return (response.body?.data ?? []).map((address: any) => this.mapBackendAddress(address));
  }

  async crearDireccion(userId: number, direccion: Direccion) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const payload = this.toAddressRequestDto(userId, direccion);

    return await to(
      this.http
        .post(`${ConstUrls.API_URL}/api/v1/direcciones/`, payload, { params, observe: 'response' })
        .toPromise()
    );
  }

  async actualizarDireccion(id: number, userId: number, direccion: Direccion) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const payload = this.toAddressRequestDto(userId, direccion);

    return await to(
      this.http
        .put(`${ConstUrls.API_URL}/api/v1/direcciones/${id}`, payload, { params, observe: 'response' })
        .toPromise()
    );
  }

  async eliminarDireccion(id: number) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
      this.http
        .delete(`${ConstUrls.API_URL}/api/v1/direcciones/${id}`, { params, observe: 'response' })
        .toPromise()
    );
  }

  private toUserRequestDto(usuario: Usuario) {
    return {
      username: usuario.nickUsuario,
      password: usuario.contrasena,
      name: usuario.nombre,
      firstSurname: usuario.primerApellido,
      secondSurname: usuario.segundoApellido,
      birthDate: usuario.fechaNacimiento,
      breakfastTime: usuario.horaDesayuno,
      isAdmin: usuario.admin ?? false,
      genderId: usuario.genero?.id,
      jobTitleId: usuario.puestoTrabajo?.id
    };
  }

  async iniciarSesion(username: string, password: string) {
    const url = `${ConstUrls.API_URL}/api/v1/usuarios/iniciar-sesion?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    return await to(
        this.http
            .post(url, null, { observe: 'response' })
            .toPromise()
    );
  }

  async obtenerUsuarios() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const response = await to(
        this.http
        .get<Usuario[]>(`${ConstUrls.API_URL}/api/v1/usuarios/`, { params, observe: 'response' })
            .toPromise()
    );

    if (Array.isArray(response)) {
      return response;
    }

    const mappedData = (response.body?.data ?? []).map((user: any) => this.mapBackendUser(user));
    const usersWithAddresses = await Promise.all(
      mappedData.map(async (user: Usuario) => {
        const direcciones = await this.obtenerDireccionesUsuario(user.id);
        return {
          ...user,
          direcciones
        };
      })
    );

    return {
      ...response,
      body: {
        ...response.body,
        data: usersWithAddresses
      }
    };
  }

  async obtenerGeneros() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const response = await to(
        this.http
        .get(`${ConstUrls.API_URL}/api/v1/usuarios/generos`, { params, observe: 'response' })
            .toPromise()
    );

    if (Array.isArray(response)) {
      return response;
    }

    const mappedData = (response.body?.data ?? []).map((g: any) => ({
      id: g?.id ?? null,
      nombre: g?.name ?? null
    }));

    return {
      ...response,
      body: {
        ...response.body,
        data: mappedData
      }
    };
  }

  async obtenerPuestos() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const response = await to(
        this.http
        .get(`${ConstUrls.API_URL}/api/v1/usuarios/puestos-de-trabajo`, { params, observe: 'response' })
            .toPromise()
    );

    if (Array.isArray(response)) {
      return response;
    }

    const mappedData = (response.body?.data ?? []).map((p: any) => ({
      id: p?.id ?? null,
      nombre: p?.name ?? null
    }));

    return {
      ...response,
      body: {
        ...response.body,
        data: mappedData
      }
    };
  }

  async crearUsuario(usuario: Usuario) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const payload = this.toUserRequestDto(usuario);

    return await to(
        this.http
        .post(`${ConstUrls.API_URL}/api/v1/usuarios/`, payload, { params, observe: 'response' })
            .toPromise()
    )
  }

  async actualizarUsuario(id: number, usuario: Usuario) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    const payload = this.toUserRequestDto(usuario);

    return await to(
        this.http
        .put(`${ConstUrls.API_URL}/api/v1/usuarios/${id}`, payload, { params, observe: 'response' })
            .toPromise()
    )
  }

  async eliminarUsuario(id: number) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .delete(`${ConstUrls.API_URL}/api/v1/usuarios/${id}`, { params, observe: 'response' })
            .toPromise()
    )
  }

}
