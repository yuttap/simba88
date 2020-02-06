import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {Withdraw} from './withdraw';

export const routes = [
    {path: '', component: Withdraw, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        Withdraw
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class WithdrawModule {
    static routes = routes;
}
