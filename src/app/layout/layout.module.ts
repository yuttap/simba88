import { NgModule }      from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { CommonModule }  from '@angular/common';

import { ButtonsModule, BsDropdownModule } from 'ngx-bootstrap';

import { ROUTES } from './layout.routes';

import { Layout } from './layout.component';
import { Sidebar } from './sidebar/sidebar.component';
import { Navbar } from './navbar/navbar.component';
import { EmptyLinkModule } from './directives/empty-link/empty-link.module';
import {MessengerDemo} from "./messenger/messenger.directive";

@NgModule({
  imports: [
    CommonModule,
    ROUTES,
    FormsModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    EmptyLinkModule
  ],
  declarations: [Layout, Sidebar, Navbar, MessengerDemo]
})
export class LayoutModule {
}
