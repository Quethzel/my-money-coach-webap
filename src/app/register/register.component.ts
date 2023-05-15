import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name!: string;
  lastName!: string;
  email!: string;
  pass!: string;
  confirmPass!: string;

  constructor() { }

  register() {

  }

}
