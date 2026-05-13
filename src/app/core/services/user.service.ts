import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Usuario } from '../models/user.model';
import to from "./utils.service";
import ConstUrls from "../../shared/contants/const-urls";
import { obtenerUsuarioLogado } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  async iniciarSesion(username: string, password: string) {
    const url = `${ConstUrls.API_URL}/api/v1/usuarios/iniciar-sesion?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    return await to(
        this.http
            .post(url, null, { observe: 'response' })
            .toPromise()
    );
  }

  async obtenerUsuarioPorId(id: number) {
    return await to(
        this.http
            .get<Usuario>('/assets/mocks/user.json')
            .toPromise()
    )
  }

  async obtenerUsuarios() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .get<Usuario[]>(`${ConstUrls.API_URL}/api/v1/usuarios/`, { params, observe: 'response' })
            .toPromise()
    )
  }

  async obtenerGeneros() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .get(`${ConstUrls.API_URL}/api/v1/generos/`, { params, observe: 'response' })
            .toPromise()
    )
  }

  async obtenerPuestos() {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .get(`${ConstUrls.API_URL}/api/v1/puestos-de-trabajo/`, { params, observe: 'response' })
            .toPromise()
    )
  }

  async crearUsuario(usuario: Usuario) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .post(`${ConstUrls.API_URL}/api/v1/usuarios/`, usuario, { params, observe: 'response' })
            .toPromise()
    )
  }

  async actualizarUsuario(id: number, usuario: Usuario) {
    const usuarioLogado = obtenerUsuarioLogado();
    const params = new HttpParams()
      .set('nickUsuario', usuarioLogado?.nickUsuario ?? '')
      .set('nickContrasena', usuarioLogado?.contrasena ?? '');

    return await to(
        this.http
        .put(`${ConstUrls.API_URL}/api/v1/usuarios/${id}`, usuario, { params, observe: 'response' })
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
