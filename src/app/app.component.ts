import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'money-coach-pwa';

  constructor() {
    console.log('v 1.1.0');
  }
}
