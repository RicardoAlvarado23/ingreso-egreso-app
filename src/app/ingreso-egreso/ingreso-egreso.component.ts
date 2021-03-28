import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  subscriptionCargando: Subscription;
  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>
    ) { }
    
  ngOnInit(): void {
    this.form = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1)]],
    });
    this.subscriptionCargando = this.store.select('ui')
      .subscribe((ui) => {
        this.cargando = ui.isLoading;
      });
  }

  
  ngOnDestroy(): void {
    this.subscriptionCargando.unsubscribe();
  }

  enviar() {
    if (this.form.invalid) return;
    console.log(this.form.value);
    const {descripcion, monto} = this.form.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.store.dispatch(ui.isLoading());
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
        .then((ref) => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            title: 'Registro Exitoso!',
            text:'Se ha registrado correctamente la información',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.form.reset();
          this.tipo = 'ingreso';
        }) 
        .catch(err => {
          this.store.dispatch(ui.stopLoading());
          console.error(err);
          const msg = err.message;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: msg,
            confirmButtonText: 'Aceptar',
          });
        });
  }

}
