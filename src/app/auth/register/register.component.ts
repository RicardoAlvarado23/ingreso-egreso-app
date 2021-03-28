import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });

  }

  submit() {
    if (this.form.invalid) return;
    const { nombre, correo, password } = this.form.value;
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    Swal.showLoading();
    this.authService.crearUsuario(nombre, correo, password)
        .then((credenciales) => {
          Swal.close();
          this.router.navigateByUrl('/');
        })
        .catch((error) => {
          Swal.close();
          const msg = error.message;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: msg,
            confirmButtonText: 'Aceptar',
          });
        });

  }

}
