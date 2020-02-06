import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {Register} from './register';
import {ClipboardModule} from 'ngx-clipboard';

export const routes = [
    {path: '', component: Register, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        Register
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ClipboardModule
    ]
})
export class RegisterModule {
    static routes = routes;
}
