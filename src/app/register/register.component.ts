import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name!: string;
  lastName!: string;
  email!: string;
  password!: string;
  confirmPass!: string;

  constructor(private authService: AuthService) { }

  register() {
    const user = {
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    this.authService.userRegister(user);//TODO: pass will not be send it without encryption!
  }

}
