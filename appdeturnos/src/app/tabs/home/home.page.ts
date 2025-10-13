import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



interface Meal {
  type: string;
  icon: string;
  color: string;
  consumed: number;
  target: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})


export class HomePage implements OnInit {
  usuarios: any[] = [];
  nuevoUsuario = { dni: '', nombre: '', email: '', telefono: '' };

  editando = false;
  usuarioEditando: any = null;
  db: any;

  

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.db.getAll('usuario');
  }

  async agregarUsuario() {
    if (!this.nuevoUsuario.dni || !this.nuevoUsuario.nombre || !this.nuevoUsuario.email) {
      alert('Por favor, completá los campos obligatorios.');
      return;
    }
    await this.db.insert('usuario', this.nuevoUsuario);
    this.nuevoUsuario = { dni: '', nombre: '', email: '', telefono: '' };
    await this.cargarUsuarios();
  }

  editarUsuario(u: any) {
    this.editando = true;
    this.usuarioEditando = { ...u };
  }

  async guardarEdicion() {
    if (!this.usuarioEditando?.dni) return;
    const { dni, ...resto } = this.usuarioEditando;
    await this.db.update('usuario', dni, resto);
    this.editando = false;
    this.usuarioEditando = null;
    await this.cargarUsuarios();
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEditando = null;
  }

  async eliminarUsuario(dni: string) {
    const ok = confirm('¿Eliminar este usuario?');
    if (!ok) return;
    await this.db.delete('usuario', dni);
    await this.cargarUsuarios();
  }
}
