import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Login } from './login.component';

export const routes = [
  { path: '', component: Login, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class LoginModule {
  static routes = routes;
}
