import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ReportHide} from './report-hide';
import {ClipboardModule} from 'ngx-clipboard';

export const routes = [
    {path: '', component: ReportHide, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        ReportHide
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ClipboardModule,
        NKDatetimeModule
    ]
})
export class ReportHideModule {
    static routes = routes;
}
