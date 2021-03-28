import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  subscription: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.subscription = this.store.select('user')
        .subscribe(({user}) => {
          this.usuario = user;
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
  }

  cerrarSesion() {
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.auth.logout()
    .then((cred) => {
      Swal.close();
      this.router.navigateByUrl('/login')
    })
    .catch (( error) => {
      Swal.close();
      const msg = error.message;
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
        confirmButtonText: 'Aceptar',
      });
    });
  }

}
