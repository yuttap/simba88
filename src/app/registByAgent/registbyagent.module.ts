import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {Registbyagent} from './registbyagent';
import {ClipboardModule} from 'ngx-clipboard';

export const routes = [
    {path: '', component: Registbyagent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        Registbyagent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ClipboardModule
    ]
})
export class RegistbyagentModule {
    static routes = routes;
}
