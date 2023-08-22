import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = 'v1.02.08';

  constructor(private userService: UserService) {
    this.userService.loadCities();
  }
}
