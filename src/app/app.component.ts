/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "./_services";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './scss/application.scss'
  ],
  template: `<router-outlet></router-outlet>`
})
export class App {
  constructor(private router: Router,
              private userService: UserService){

      if (!this.userService.getToken()){
          this.router.navigate(['/login']);
      }
  }
}
