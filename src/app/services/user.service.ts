import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/interfaces/IUser';
import { IUserCity } from '../models/interfaces/ICity';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = `${environment.mcApi}/user`;
  private cities: IUserCity[];

  constructor(private http: HttpClient) { }

  get cties() {
    return this.cities;
  }

  getInfo() {
    return this.http.get<IUser>(this.apiURL);
  }

  save(user: IUser) {
    return this.http.put(this.apiURL, user);
  }

  //TODO: delete account is not implemented
  deleteAccount() {

  }
//TODO: this data should be in the database
  loadCities() {
    this.cities = [
      { code: 'MTY', name: 'Monterrey', default: true },
      { code: 'CDMX', name: 'CDMX', default: false },
      { code: 'XAL', name: 'Xalapa', default: false },
      { code: 'OAX', name: 'Oaxaca', default: false },
      { code: 'HOU', name: 'Houston-Texas', default: false },
      { code: 'PBL', name: 'Puebla', default: false },
    ];

    return of(this.cities);
  }

  getDefaultCity() {
    let city = this.cities.find(c => c.default == true);
    if (!city) city = this.cities[0];
    return city;
  }  

  getCityCodes() {
    return this.cities.map(c => c.code);
  }

}
