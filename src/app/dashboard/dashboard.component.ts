import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private ingesoEgresoSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService
    ) { }
  

  ngOnInit(): void {
    this.subscription = this.store.select('user')
        .pipe(
          filter( auth => {
            return auth.user != null;
          })
        )
        .subscribe(({user}) => {
          this.ingesoEgresoSubscription = this.ingresoEgresoService.initIngresoEgresosListener(user.uid)
              .subscribe((ingresosEgresosFB: any) => {
                this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresosFB}));
              });
        });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.ingesoEgresoSubscription?.unsubscribe();
  }

}
