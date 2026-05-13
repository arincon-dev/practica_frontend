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
    direccionesOriginales: Direccion[] = [];
    selectedDireccionIndex: number = -1;
    
    loading: boolean = false;
    errorMessage: string = '';
    
    nuevaDireccion: Direccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
    modoDireccion: 'VIEW' | 'FORM' = 'VIEW';
    editandoDireccionIndex: number = -1;

    constructor(private userService: UserService) {}

    async ngOnInit() {
        await this.cargarCombo();
        if (this.modo === 'UPDATE' && this.usuarioEditando) {
            this.usuario = { ...this.usuarioEditando };
            this.direcciones = (this.usuario.direcciones || []).map(d => ({ ...d }));
            this.direccionesOriginales = (this.usuario.direcciones || []).map(d => ({ ...d }));
        } else {
            this.usuario = { ...usuarioInicial };
            this.direcciones = [];
            this.direccionesOriginales = [];
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

        const userId = response.body?.data?.id ?? this.usuario.id;
        const syncOk = await this.sincronizarDirecciones(userId);

        if (!syncOk) {
            this.errorMessage = 'Usuario guardado, pero hubo un error al sincronizar direcciones.';
            return;
        }

        this.cerrarPopUpOk.emit();
    }

    private async sincronizarDirecciones(userId: number | null): Promise<boolean> {
        if (!userId) {
            return false;
        }

        if (this.direcciones.length > 0 && !this.direcciones.some(d => d.direccionPrincipal)) {
            this.direcciones[0].direccionPrincipal = true;
        }

        const originalesIds = new Set((this.direccionesOriginales || []).filter(d => !!d.id).map(d => d.id));
        const actualesIds = new Set((this.direcciones || []).filter(d => !!d.id).map(d => d.id));

        for (const originalId of originalesIds) {
            if (!actualesIds.has(originalId)) {
                const deleteResponse = await this.userService.eliminarDireccion(originalId);
                if (Array.isArray(deleteResponse)) {
                    return false;
                }
            }
        }

        const noPrincipales = this.direcciones.filter(d => !d.direccionPrincipal);
        const principales = this.direcciones.filter(d => d.direccionPrincipal);
        const ordenPersistencia = [...noPrincipales, ...principales];

        for (const direccion of ordenPersistencia) {
            if (direccion.id) {
                const updateResponse = await this.userService.actualizarDireccion(direccion.id, userId, direccion);
                if (Array.isArray(updateResponse)) {
                    return false;
                }
                continue;
            }

            const createResponse = await this.userService.crearDireccion(userId, direccion);
            if (Array.isArray(createResponse)) {
                return false;
            }

            direccion.id = createResponse.body?.data?.id ?? null;
        }

        return true;
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
        this.editandoDireccionIndex = -1;
        this.errorMessage = '';
    }

    actualizarDireccion() {
        if (this.editandoDireccionIndex < 0 || this.editandoDireccionIndex >= this.direcciones.length) {
            return;
        }

        if (!this.nuevaDireccion.nombreCalle || this.nuevaDireccion.numeroCalle === null) {
            this.errorMessage = 'Completa nombre y número de calle.';
            return;
        }

        const anterior = this.direcciones[this.editandoDireccionIndex];
        this.direcciones[this.editandoDireccionIndex] = {
            ...anterior,
            nombreCalle: this.nuevaDireccion.nombreCalle,
            numeroCalle: this.nuevaDireccion.numeroCalle
        };

        this.cancelarNuevaDireccion();
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

    eliminarDireccionSeleccionada() {
        if (this.selectedDireccionIndex < 0 || this.selectedDireccionIndex >= this.direcciones.length) {
            return;
        }

        this.eliminarDireccion(this.selectedDireccionIndex);
    }

    seleccionarDireccion(index: number) {
        this.selectedDireccionIndex = index;
    }

    establecerPrincipal(index: number) {
        this.direcciones.forEach((d, i) => d.direccionPrincipal = (i === index));
    }

    cancelarNuevaDireccion() {
        this.nuevaDireccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
        this.modoDireccion = 'VIEW';
        this.editandoDireccionIndex = -1;
        this.errorMessage = '';
    }

    mostrarFormularioDireccionCrear() {
        this.modoDireccion = 'FORM';
        this.selectedDireccionIndex = -1;
        this.editandoDireccionIndex = -1;
        this.nuevaDireccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
    }

    mostrarFormularioDireccionEditar() {
        if (this.selectedDireccionIndex < 0 || this.selectedDireccionIndex >= this.direcciones.length) {
            return;
        }

        const dir = this.direcciones[this.selectedDireccionIndex];
        this.modoDireccion = 'FORM';
        this.editandoDireccionIndex = this.selectedDireccionIndex;
        this.nuevaDireccion = {
            id: dir.id,
            nombreCalle: dir.nombreCalle,
            numeroCalle: dir.numeroCalle,
            usuario: dir.usuario,
            direccionPrincipal: dir.direccionPrincipal
        };
    }

    onGuardarDireccion() {
        if (this.editandoDireccionIndex >= 0) {
            this.actualizarDireccion();
            return;
        }

        this.agregarDireccion();
    }
}
