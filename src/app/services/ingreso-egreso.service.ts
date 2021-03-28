import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService
    ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.usuario.uid;
    return this.firestore.doc(`/${uid}/ingresos-egresos`)
        .collection('items')
        .add({... ingresoEgreso})
  }

  initIngresoEgresosListener(uuid: string) {
    return this.firestore.collection(`/${uuid}/ingresos-egresos/items`)
        .snapshotChanges()
        .pipe(
          map( snapshot => {
            return snapshot.map((doc) => {
              const data: {} = doc.payload.doc.data();
              return {
                uid: doc.payload.doc.id,
                ... data
              }
            })
          })
        );
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.usuario.uid;
    return this.firestore.doc(`/${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }


}
