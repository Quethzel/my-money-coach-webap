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
      settings: this.fb.group({
        monthlyExpenseBudget: [null]
      })
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
    const profile = this.profileForm.getRawValue();
    const user = { ...profile } as IUser;

    this.userService.save(user).subscribe(user => {
      alert('user information updated!');
    })
  }

  saveAppSettings() {
    const settings = this.settingsForm.getRawValue();
    const user = { ...settings } as IUser;

    this.userService.save(user).subscribe(user => {
      alert('app settings updated!');
    });

  }

  deleteAccount() {
    console.log('account was deleted');
  }

  private setUserInfo(dataUser: IUser) {
    this.profileForm.patchValue(dataUser);
    this.settingsForm.patchValue(dataUser);
  }


}
