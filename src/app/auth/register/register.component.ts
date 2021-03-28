import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  uiSubscription: Subscription;
  cargando: boolean = false;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  submit() {
    if (this.form.invalid) return;
    const { nombre, correo, password } = this.form.value;
    this.store.dispatch(ui.isLoading())
    this.authService.crearUsuario(nombre, correo, password)
        .then((credenciales) => {
          this.store.dispatch(ui.stopLoading());
          this.router.navigateByUrl('/');
        })
        .catch((error) => {
          this.store.dispatch(ui.stopLoading());
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
