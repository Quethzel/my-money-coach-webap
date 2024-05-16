import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAuth!: boolean;
  username!: string;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.userAuth.subscribe(() => {
      this.isAuth = this.authService.isAuthenticated;
      if (this.isAuth) {
        this.username = this.authService.username != null
          ? this.authService.username
          : 'Account';
      }
    });
  }

  logout() {
    this.authService.logout(); 
  }

  navigateToVariableExpensesList() {
    this.router.navigate(['/variable-expenses', new Date().getFullYear(), new Date().getMonth() + 1]);
  }

}
