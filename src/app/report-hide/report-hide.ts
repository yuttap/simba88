import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService, UserService} from "../_services";
import {Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import {ClipboardService} from 'ngx-clipboard';
import * as moment from 'moment';

@Component({
    selector: 'report-hide',
    styleUrls: ['./report-hide.style.scss'],
    templateUrl: './report-hide.template.html',
    host: {
        class: 'report-hide-page app'
    }
})
export class ReportHide implements OnInit {

    public result: any = [];

    @ViewChild('topupModal') public topupModal:ModalDirective;

    startDate: Date = null;
    endDate: Date = null;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };


    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private _clipboardService: ClipboardService) {
        if(this.settings.getPosition() !== 'SUPER_ADMIN' && this.settings.getPosition() !== 'J_ADMIN'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/app/home']);

        }

        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() -1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        }

    }

    ngOnInit() {
        this.onLoad();
    }

    yesterday(){
        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-2, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 11, 59, 59);
        }

        this.onLoad();
    }

    today(){
        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() -1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        }

        this.onLoad();
    }

    onLoad(){
        console.log('---- 1 ----');

        let obj = {
            startDate: this.startDate ,
            endDate: this.endDate
        };


        this.http.post(`${this.settings.getAppSetting('url')}/report/deposit/hide`, obj)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
                        console.log(data);
                        for (let i = 0; i < data.result.length; i++) {


                            let startTime = new Date(data.result[i].createDate);
                            let endTime = new Date();
                            let difference = endTime.getTime() - startTime.getTime();
                            let resultInMinutes = Math.round(difference / 60000);


                            data.result[i].lminute = resultInMinutes;
                        }

                        this.result = data.result;

                    } else {
                        if(data.code === 1005 || data.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }

                },
                error=>{
                    if(error.status == 500){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                })
    }

    revert(transactionId){

        if(confirm('คุณต้องการนำรายการกลับไปหน้าหลักใช่หรือไม่')){
            this.http.put(`${this.settings.getAppSetting('url')}/report/deposit/revert`, {transactionId: transactionId})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {
                        if (data.code == 0) {
                            alert(data.message);
                            this.onLoad();
                        } else {
                            if(data.code === 1005 || data.code === 1003){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            } else {
                                alert(data.message);
                            }
                        }

                    },
                    error=>{
                        if(error.status == 500){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    })
        }

    }
}
