import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `${environment.mcApi}`;
  private TOKEN_KEY = 'token';
  constructor(private http: HttpClient) { }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  userRegister(user: any) {
    return this.http.post<any>(`${this.apiURL}/register`, user).subscribe(res => {
      this.saveToken(res);
    })
  }


  loginByEmail(email: string, password: string) {
    this.http.post<any>(`${this.apiURL}/loginByEmail`, { email, password})
    .subscribe(res => {
      this.saveToken(res);
    });
  }

  private saveToken(token: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  test() {
    this.http.get(`${this.apiURL}/test`)
    .subscribe(res => {
      console.log(res);
    });
  }



}
