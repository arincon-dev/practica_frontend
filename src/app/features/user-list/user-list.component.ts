import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from '../../core/services/user.service';
import { Usuario } from '../../core/models/user.model';
import ConstRoutes from '../../shared/contants/const-routes';
import ConstLocalStorage from '../../shared/contants/const-local-storage';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [ CommonModule, UserPopupComponent ]
})
export class UserListComponent implements OnInit {
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  modoPopup: 'CLOSED' | 'CREATE' | 'UPDATE' | 'DELETE' = 'CLOSED';
  usuarioEnEdicion: Usuario | null = null;
  usuarios: Usuario[] = [];
  selectedUserIndex: number = 0;
  loading: boolean = false;
  errorMessage: string = '';
  deleteConfirming: boolean = false;

  constructor(private router: Router, private userService: UserService) {

  }

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
  }

  onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
    this.usuarioEnEdicion = null;
    // Refresh list after create/update
    this.cargarUsuarios();
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
    this.usuarioEnEdicion = null;
  }
  
  abrirCrearUsuario() {
    this.modoPopup = 'CREATE';
    this.usuarioEnEdicion = null;
  }

  abrirEditarUsuario() {
    if (this.selectedUserIndex < 0 || this.selectedUserIndex >= this.usuarios.length) {
      return;
    }
    this.modoPopup = 'UPDATE';
    this.usuarioEnEdicion = this.usuarios[this.selectedUserIndex];
  }

  abrirEliminarUsuario() {
    if (this.selectedUserIndex < 0 || this.selectedUserIndex >= this.usuarios.length) {
      return;
    }
    this.modoPopup = 'DELETE';
  }

  cancelarEliminarUsuario() {
    this.modoPopup = 'CLOSED';
  }

  async confirmarEliminarUsuario() {
    await this.eliminarUsuario();
    this.modoPopup = 'CLOSED';
  }

  async eliminarUsuario() {
    if (this.selectedUserIndex < 0 || this.selectedUserIndex >= this.usuarios.length) {
      return;
    }

    this.loading = true;
    const usuarioId = this.usuarios[this.selectedUserIndex].id;
    const response = await this.userService.eliminarUsuario(usuarioId);
    this.loading = false;

    if (Array.isArray(response)) {
      this.errorMessage = 'Error al eliminar el usuario.';
      return;
    }

    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    const response = await this.userService.obtenerUsuarios();
    this.loading = false;

    if (Array.isArray(response)) {
      this.errorMessage = 'No se pudieron cargar los usuarios.';
      return;
    }

    this.usuarios = response.body?.data ?? [];
    this.selectedUserIndex = this.usuarios.length > 0 ? 0 : -1;
  }

  seleccionarUsuario(index: number): void {
    this.selectedUserIndex = index;
  }

  logout(): void {
    localStorage.removeItem(ConstLocalStorage.USUARIO_LOGADO_STORAGE);
    this.router.navigate([ConstRoutes.PATH_LOGIN]);
  }

  getNombreCompleto(usuario: Usuario): string {
    const segundo = usuario.segundoApellido ? ` ${usuario.segundoApellido}` : '';
    return `${usuario.primerApellido ?? ''}${segundo}, ${usuario.nombre ?? ''}`.trim();
  }

  getDireccionPrincipal(usuario: Usuario): string {
    const direccionPrincipal = usuario.direcciones?.find(dir => dir.direccionPrincipal);

    if (!direccionPrincipal) {
      return '-';
    }

    const numero = direccionPrincipal.numeroCalle !== null && direccionPrincipal.numeroCalle !== undefined
      ? `, ${direccionPrincipal.numeroCalle}`
      : '';

    return `${direccionPrincipal.nombreCalle}${numero}`;
  }

  getDireccionesExtra(usuario: Usuario): number {
    const totalDirecciones = usuario.direcciones?.length ?? 0;
    return totalDirecciones > 0 ? totalDirecciones - 1 : 0;
  }

  getHoraDesayuno(usuario: Usuario): string {
    const hora = usuario.horaDesayuno;

    if (!hora) {
      return '-';
    }

    if (typeof hora === 'string') {
      return hora.length >= 5 ? hora.substring(0, 5) : hora;
    }

    return String(hora);
  }

  getIconoGenero(usuario: Usuario): string {
    const genero = (usuario.genero?.nombre ?? '').toLowerCase();

    if (genero === 'hombre' || genero === 'male') {
      return '♂';
    }

    if (genero === 'mujer' || genero === 'female') {
      return '♀';
    }

    return '○';
  }
}
