import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Home } from './home';
import { ClipboardModule } from 'ngx-clipboard';

export const routes = [
  { path: '', component: Home, pathMatch: 'full' }
];

@NgModule({
  declarations: [
      Home
  ],
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    RouterModule.forChild(routes),
      ClipboardModule
  ]
})
export class HomeModule {
  static routes = routes;
}
