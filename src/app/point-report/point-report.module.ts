import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {PointReport} from './point-report';
import {ClipboardModule} from 'ngx-clipboard';
import {NgxPaginationModule} from "ngx-pagination";

export const routes = [
    {path: '', component: PointReport, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        PointReport
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
export class PointReportModule {
    static routes = routes;
}
