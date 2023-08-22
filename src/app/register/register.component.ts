import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPass: ''
  };
    
  errorMessage: string;

  constructor(private authService: AuthService) {
    this.errorMessage = null;
  }

  register() {
    if (this.user.password != this.user.confirmPass) {
      this.errorMessage = 'Passwords not match. Please verify';
      return;
    } else {
      //TODO: pass will not be send it without encryption!
      this.authService.userRegister(this.user);
    }
  }

}
