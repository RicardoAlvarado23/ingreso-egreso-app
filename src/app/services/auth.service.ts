import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore
    ) { }

  initAuthListener() {
    this.auth.authState.subscribe((firebaseUser: any) => {
      console.log(firebaseUser);
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
