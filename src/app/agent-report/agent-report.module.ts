import 'messenger/build/js/messenger';
import 'messenger/build/js/messenger-theme-flat';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgxPaginationModule} from "ngx-pagination";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import 'parsleyjs';
import {AgentReport} from "./agent-report";

export const routes = [
    {path: '', component: AgentReport}
];

@NgModule({
    declarations: [
        AgentReport,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NKDatetimeModule,
        RouterModule.forChild(routes),

    ]
})
export class AgentReportModule {
    static routes = routes;
}
