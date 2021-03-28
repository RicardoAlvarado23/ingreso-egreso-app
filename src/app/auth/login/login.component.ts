import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });


  }

  submit() {
    if (this.form.invalid) return;
    const {correo, password} = this.form.value;
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.authService.login(correo, password)
        .then ((credentials) => {
          Swal.close();
          console.log(credentials);
          this.router.navigateByUrl('/')
        })
        .catch (( error) => {
          Swal.close();
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
