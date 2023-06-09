import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAuth!: boolean;

  constructor(private authService: AuthService) {
    this.isAuth = this.authService.isAuthenticated;
  }

  logout() {
    this.authService.logout(); 
  }
}
