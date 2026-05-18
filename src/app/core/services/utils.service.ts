import {HttpHeaders, HttpParams} from "@angular/common/http";
import ConstUrls from "../../shared/contants/const-urls";
import ConstLocalStorage from "../../shared/contants/const-local-storage";
import {Usuario} from "../models/user.model";

export default async function to(promise: Promise<any>) {
    try {
        return await promise;
    } catch (err) {
        return [err];
    }
}

export function isOkResponse(response) {
    return response?.body?.type === "OK";
}

export function loadResponseData(response) {
    return response.body.data;
}

export function loadResponseError(response) {
    if (!response || !response.body || !response.body.exception) {
        return "Error inesperado de servidor";
    }

    return response.body.exception.codigoDeError + ' ' + response.body.exception.mensajeDeError;
}

export const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});

export function loadCredentials(): HttpParams {
    const usuario = obtenerUsuarioLogado();
    return new HttpParams()
        .set(ConstUrls.NICK_USUARIO_PARAM, usuario?.nickUsuario ?? '')
        .set(ConstUrls.PASS_USUARIO_PARAM, usuario?.contrasena ?? '');
}

export function guardarUsuarioLogado(usuario: Usuario) {
    localStorage.setItem(ConstLocalStorage.USUARIO_LOGADO_STORAGE, JSON.stringify(usuario));
}

export function obtenerUsuarioLogado(): Usuario | null {
    return JSON.parse(localStorage.getItem(ConstLocalStorage.USUARIO_LOGADO_STORAGE));
}
