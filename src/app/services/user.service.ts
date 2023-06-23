import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = `${environment.mcApi}/user`;

  constructor(private http: HttpClient) { }

  getInfo() {
    return this.http.get<IUser>(this.apiURL);
  }

  save(user: IUser) {
    return this.http.put(this.apiURL, user);
  }

  deleteAccount() {

  }

}
