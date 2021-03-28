import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }


  

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      console.log('Realizando suscripcion en ui');
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  submit() {
    if (this.form.invalid) return;
    this.store.dispatch(ui.isLoading());
    const {correo, password} = this.form.value;
    /* Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    }); */
    this.authService.login(correo, password)
        .then ((credentials) => {
         // Swal.close();
          this.store.dispatch(ui.stopLoading());
          console.log(credentials);
          this.router.navigateByUrl('/')
        })
        .catch (( error) => {
         // Swal.close();
          this.store.dispatch(ui.stopLoading());
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
