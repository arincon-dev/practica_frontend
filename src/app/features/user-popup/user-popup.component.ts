import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../core/services/user.service";
import { Usuario, usuarioInicial } from "../../core/models/user.model";
import { Genero } from "../../core/models/genero.model";
import { PuestoDeTrabajo } from "../../core/models/puestodetrabajo.model";
import { Direccion } from "../../core/models/direccion.model";

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [ CommonModule, FormsModule ]
})
export class UserPopupComponent implements OnInit {

    @Input() modo: 'CREATE' | 'UPDATE' = 'CREATE';
    @Input() usuarioEditando: Usuario | null = null;

    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();

    usuario: Usuario = { ...usuarioInicial };
    generos: Genero[] = [];
    puestos: PuestoDeTrabajo[] = [];
    direcciones: Direccion[] = [];
    selectedDireccionIndex: number = -1;
    
    loading: boolean = false;
    errorMessage: string = '';
    
    nuevaDireccion: Direccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
    modoDireccion: 'VIEW' | 'NEW' | 'EDIT' = 'VIEW';

    constructor(private userService: UserService) {}

    async ngOnInit() {
        await this.cargarCombo();
        if (this.modo === 'UPDATE' && this.usuarioEditando) {
            this.usuario = { ...this.usuarioEditando };
            this.direcciones = this.usuario.direcciones || [];
        } else {
            this.usuario = { ...usuarioInicial };
            this.direcciones = [];
        }
    }

    async cargarCombo() {
        const genResponse = await this.userService.obtenerGeneros();
        this.generos = !Array.isArray(genResponse) ? genResponse.body?.data ?? [] : [];

        const puesResponse = await this.userService.obtenerPuestos();
        this.puestos = !Array.isArray(puesResponse) ? puesResponse.body?.data ?? [] : [];
    }

    async onSave() {
        if (!this.validarFormulario()) {
            this.errorMessage = 'Por favor completa todos los campos requeridos.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.usuario.direcciones = this.direcciones;

        let response;
        if (this.modo === 'CREATE') {
            response = await this.userService.crearUsuario(this.usuario);
        } else {
            response = await this.userService.actualizarUsuario(this.usuario.id, this.usuario);
        }

        this.loading = false;

        if (Array.isArray(response)) {
            this.errorMessage = 'Error al guardar el usuario.';
            return;
        }

        this.cerrarPopUpOk.emit();
    }

    onCancel() {
        this.cerrarPopUpCancel.emit();
    }

    private validarFormulario(): boolean {
        return !!(
            this.usuario.nickUsuario &&
            this.usuario.nombre &&
            this.usuario.primerApellido &&
            this.usuario.fechaNacimiento &&
            this.usuario.horaDesayuno &&
            this.usuario.genero?.id &&
            this.usuario.puestoTrabajo?.id &&
            this.direcciones.length > 0
        );
    }

    // Address methods
    agregarDireccion() {
        if (!this.nuevaDireccion.nombreCalle || this.nuevaDireccion.numeroCalle === null) {
            this.errorMessage = 'Completa nombre y número de calle.';
            return;
        }

        const dir: Direccion = {
            id: null,
            nombreCalle: this.nuevaDireccion.nombreCalle,
            numeroCalle: this.nuevaDireccion.numeroCalle,
            usuario: null,
            direccionPrincipal: this.direcciones.length === 0 // First is main
        };

        this.direcciones.push(dir);
        this.nuevaDireccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
        this.modoDireccion = 'VIEW';
        this.errorMessage = '';
    }

    eliminarDireccion(index: number) {
        this.direcciones.splice(index, 1);
        if (this.selectedDireccionIndex === index) {
            this.selectedDireccionIndex = -1;
        }
        // Ensure at least one is main
        if (this.direcciones.length > 0 && !this.direcciones.some(d => d.direccionPrincipal)) {
            this.direcciones[0].direccionPrincipal = true;
        }
    }

    establecerPrincipal(index: number) {
        this.direcciones.forEach((d, i) => d.direccionPrincipal = (i === index));
    }

    cancelarNuevaDireccion() {
        this.nuevaDireccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
        this.modoDireccion = 'VIEW';
        this.errorMessage = '';
    }

    mostrarFormularioDireccion() {
        this.modoDireccion = 'NEW';
        this.selectedDireccionIndex = -1;
    }
}
