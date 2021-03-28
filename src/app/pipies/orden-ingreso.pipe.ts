import { Pipe, PipeTransform } from '@angular/core';

export interface IngresoEgresoModeloSec {
  tipo: string;
  descripcion: string;
  monto: number;
  uid: string;
}

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgresoModeloSec[]): IngresoEgresoModeloSec[] {
    const arregloTmp = [... items];
    return arregloTmp.sort((a, b) => {
        if (a.tipo == 'ingreso') {
          return -1;
        } else {
          return 1;
        }
    });
  }

}
