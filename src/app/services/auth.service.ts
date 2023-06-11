import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `${environment.mcApi}`;
  private TOKEN_KEY = 'token';

  private _userAuth = new BehaviorSubject(false);
  userAuth = this._userAuth.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  userRegister(user: any) {
    return this.http.post<any>(`${this.apiURL}/register`, user).subscribe({
      next: (result) => {
        this.saveToken(result);
        this.navToHome();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  loginByEmail(email: string, password: string) {
    this.http.post<any>(`${this.apiURL}/loginByEmail`, { email, password})
    .subscribe({
        next: (result) => {
          this.saveToken(result);
          this.navToHome();
        },
        error: (e) => {
          console.error(e); 
        }
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._userAuth.next(false);
    this.router.navigate(['/login']);
  }

  private saveToken(token: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._userAuth.next(true);
  }

  private navToHome() { 
      this.router.navigate(['/home']);
  }

  test() {
    this.http.get(`${this.apiURL}/test`)
    .subscribe(res => {
      console.log(res);
    });
  }



}
