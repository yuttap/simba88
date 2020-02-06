import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {Promotion} from './promotion';
import {ClipboardModule} from 'ngx-clipboard';

export const routes = [
    {path: '', component: Promotion, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        Promotion
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ClipboardModule
    ]
})
export class PromotionModule {
    static routes = routes;
}
