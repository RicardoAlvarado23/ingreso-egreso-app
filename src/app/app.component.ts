import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IngresosEgresosApp';

  constructor(private auth: AuthService) {
    this.auth.initAuthListener();
  }

}
