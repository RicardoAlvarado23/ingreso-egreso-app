import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router
    ) { }

  ngOnInit(): void {
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
