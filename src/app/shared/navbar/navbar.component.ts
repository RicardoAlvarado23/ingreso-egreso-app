import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  usuario: Usuario;
  subscription: Subscription;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('user')
        .subscribe(({user}) => {
          this.usuario = user;
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
