import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import ConstRoutes from '../../shared/contants/const-routes';
import { guardarUsuarioLogado } from '../../core/services/utils.service';
import { usuarioInicial } from '../../core/models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private router: Router, private userService: UserService) {
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    this.isSubmitting = true;

    const response = await this.userService.iniciarSesion(this.username, this.password);
    this.isSubmitting = false;

    if (Array.isArray(response)) {
      this.errorMessage = 'Error al conectar con el backend.';
      return;
    }

    const loginOk = response.body?.data === true;

    if (!loginOk) {
      this.errorMessage = 'Usuario o contrasena incorrectos.';
      return;
    }

    guardarUsuarioLogado({
      ...usuarioInicial,
      nickUsuario: this.username,
      contrasena: this.password
    });

    await this.router.navigate([ConstRoutes.PATH_USUARIOS]);
  }
}
