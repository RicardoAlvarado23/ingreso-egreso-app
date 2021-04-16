import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducers';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: any[] = [];
  private subscription: Subscription;
  constructor(private store: Store<AppStateWithIngreso>,
              private ingresoEgresoService: IngresoEgresoService
    ) { }
  

  ngOnInit(): void {
     this.subscription = this.store.select('ingresosEgresos')
         .subscribe(({ items }) => {
            this.ingresosEgresos = items;
         })
  }

  borrar(uid) {
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    }); 
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
        .then(() => {
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Mensaje del Sistema',
            text: 'Se ha eliminado correctamente el item',
            confirmButtonText: 'Aceptar',
          });
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
        })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
