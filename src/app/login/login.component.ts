import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email!: string;
  pass!: string;

  constructor(private authService: AuthService) { }

  login() {
    this.authService.loginByEmail(this.email, this.pass); //TODO: pass will not send without be encripted!
  }

  test() {
    this.authService.test();
  }
}
