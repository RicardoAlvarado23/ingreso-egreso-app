import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>
    ) { }

  initAuthListener() {
    this.auth.authState.subscribe((firebaseUser: any) => {
      if (firebaseUser) {
        this.userSubscription = this.firestore.doc(`${firebaseUser.uid}/usuario`).valueChanges()
            .subscribe((fsUser: any) => {
              const user = Usuario.fromFireStore(fsUser);
              this.store.dispatch(authActions.setUser({ user }))
            })
      } else {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }


  crearUsuario(nombre: string, email: string, password: string) {
    console.log({ nombre, email, password});
    return this.auth.createUserWithEmailAndPassword(email, password)
        .then( ( {user}) => {
            const usario = new Usuario(user.uid, nombre, email);
            return this.firestore.doc(`${user.uid}/usuario`)
                .set({...usario});
        });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fUser =>  fUser != null )
    );
  }
}
