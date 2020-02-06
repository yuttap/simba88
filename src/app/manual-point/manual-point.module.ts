import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ManualPoint} from './manual-point';
import {ClipboardModule} from 'ngx-clipboard';
import {NgxPaginationModule} from "ngx-pagination";

export const routes = [
    {path: '', component: ManualPoint, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        ManualPoint
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ClipboardModule,
        NgxPaginationModule,
        NKDatetimeModule
    ]
})
export class ManualPointModule {
    static routes = routes;
}
