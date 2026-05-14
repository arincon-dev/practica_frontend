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
    fechaNacimientoUi: string = '';
    horaDesayunoUi: string = '';
    
    nuevaDireccion: Direccion = { id: null, nombreCalle: '', numeroCalle: null, usuario: null, direccionPrincipal: false };
    modoDireccion: 'VIEW' | 'FORM' = 'VIEW';
    editandoDireccionIndex: number = -1;

    constructor(private userService: UserService) {}

    private toDateInputValue(value: Date | string | null): string | null {
        if (!value) {
            return null;
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private formatFechaNacimientoUi(value: Date | string | null): string {
        const isoDate = this.toDateInputValue(value);
        if (!isoDate) {
            return '';
        }

        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    }

    private normalizeHoraDesayuno(value: unknown): string {
        if (!value) {
            return '';
        }

        const raw = String(value).trim();
        const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (!match) {
            return '';
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return '';
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    private toIsoDateFromUi(value: string): string | null {
        const trimmed = value.trim();
        const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) {
            return null;
        }

        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);

        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    private to24HourTimeFromUi(value: string): string | null {
        const trimmed = value.trim();
        const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) {
            return null;
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null;
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    async ngOnInit() {
        await this.cargarCombo();
        if (this.modo === 'UPDATE' && this.usuarioEditando) {
            this.usuario = { ...this.usuarioEditando };
            this.usuario.fechaNacimiento = this.toDateInputValue(this.usuario.fechaNacimiento);
            this.fechaNacimientoUi = this.formatFechaNacimientoUi(this.usuario.fechaNacimiento);
            this.horaDesayunoUi = this.normalizeHoraDesayuno(this.usuario.horaDesayuno);
            this.direcciones = (this.usuario.direcciones || []).map(d => ({ ...d }));
            this.direccionesOriginales = (this.usuario.direcciones || []).map(d => ({ ...d }));
        } else {
            this.usuario = { ...usuarioInicial };
            this.fechaNacimientoUi = this.formatFechaNacimientoUi(this.usuario.fechaNacimiento);
            this.horaDesayunoUi = this.normalizeHoraDesayuno(this.usuario.horaDesayuno);
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
        const fechaNacimientoIso = this.toIsoDateFromUi(this.fechaNacimientoUi);
        if (!fechaNacimientoIso) {
            this.errorMessage = 'BirthDate must use European format dd/MM/yyyy.';
            return;
        }

        const horaDesayuno24h = this.to24HourTimeFromUi(this.horaDesayunoUi);
        if (!horaDesayuno24h) {
            this.errorMessage = 'Breakfast Time must use 24-hour format HH:mm.';
            return;
        }

        this.usuario.fechaNacimiento = fechaNacimientoIso;
        this.usuario.horaDesayuno = horaDesayuno24h;

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
            if (!this.usuario.id) {
                this.loading = false;
                this.errorMessage = 'No se pudo actualizar: id de usuario inválido.';
                return;
            }
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

        const originalesIds = new Set<number>((this.direccionesOriginales || [])
            .map(d => d.id)
            .filter((id): id is number => id !== null));
        const actualesIds = new Set<number>((this.direcciones || [])
            .map(d => d.id)
            .filter((id): id is number => id !== null));

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
        const direccionesValidas = this.modo === 'CREATE'
            ? this.direcciones.length > 0
            : true;

        return !!(
            this.usuario.nickUsuario &&
            this.usuario.nombre &&
            this.usuario.primerApellido &&
            this.usuario.fechaNacimiento &&
            this.usuario.horaDesayuno &&
            this.usuario.genero?.id &&
            this.usuario.puestoTrabajo?.id &&
            direccionesValidas
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
