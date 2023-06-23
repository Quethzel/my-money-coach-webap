import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/interfaces/IUser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  sbUser = new Subscription();

  profileForm: FormGroup;
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true}]
    });

    this.settingsForm = this.fb.group({
      monthlyExpenseBudget: [null]
    });
  }

  ngOnInit(): void {
    this.sbUser = this.userService.getInfo().subscribe(data => {
      this.setUserInfo(data);
    });
    
  }

  ngOnDestroy(): void {
    if (this.sbUser) this.sbUser.unsubscribe();
  }

  saveProfile() {
    console.log(this.profileForm.getRawValue());
  }

  saveAppSettings() {
    console.log(this.settingsForm.getRawValue());
  }

  deleteAccount() {
    console.log('account was deleted');
  }

  private setUserInfo(dataUser: IUser) {
    this.profileForm.setValue({
      email: dataUser.email,
      name: dataUser.name,
      lastName: dataUser.lastName
    });

    if (dataUser.settings && dataUser.settings.monthlyExpenseBudget) {
      this.profileForm.setValue({
        monthlyExpenseBudget: dataUser.settings.monthlyExpenseBudget
      });
    }
  }

}
