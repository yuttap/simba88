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
    selector: 'manual-action',
    styleUrls: ['./manual-action.style.scss'],
    templateUrl: './manual-action.template.html',
    host: {
        class: 'report-hide-page app'
    }
})
export class ManualAction implements OnInit {

    public result: any = [];

    startDate: Date = null;
    endDate: Date = null;
    proData: any = [];
    agType : any = [];
    agentType : number = 0;
    proDetail = 0;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };
    typeSearch: string = 'ALL';
    userSearch: string = '';
    public paginationConfig  = { itemsPerPage: 50, currentPage: 1, totalItems: 0,id: 'page' };

    private formManual = {
        username: '',
        value: 0,
        type: 'MANUALDEPOSIT',
        remark: ''
    }


    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private _clipboardService: ClipboardService) {


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
        this.getAgentType();
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

    pageChange(e:any){
        console.log('Event next page ====> ', e);
        this.paginationConfig.currentPage = e;
        this.onLoad();
    }

    getAgentType(){


        this.http.get(`${this.settings.getAppSetting('url')}/home/agentType`)
            .subscribe(response => {
                if (response.code == 0) {
                    this.agType = response.result;

                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });

    }

    onLoad(){

        let obj = {
            startDate: this.startDate ,
            endDate: this.endDate,
            type: this.typeSearch,
            username: this.userSearch,
            agentType: parseInt(this.agentType),
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage
        };

        this.http.post(`${this.settings.getAppSetting('url')}/backoffice/report`, obj)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {

                        this.result = data.result.list;
                        this.paginationConfig.totalItems = data.result.total;

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

        this.http.get(`${this.settings.getAppSetting('url')}/promotion`, obj)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                console.log(data)
                    if (data.code == 0) {
                        this.proData = data.result;
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

)
        this.http.post(`${this.settings.getAppSetting('url')}/report/promotionReport`, obj)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
                        this.proDetail = data.result.promotion;
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

    submit(){
        if(confirm('คุณต้องการทำรายการใช่หรือไม่')){
            if(this.formManual.type === 'MANUALDEPOSIT'){

                let obj = {
                    customer_account: this.formManual.username,
                    amount: this.formManual.value,
                    promotionName: this.formManual.promotionName,
                    description: this.formManual.remark
                }

                this.http.post(`${this.settings.getAppSetting('url')}/backoffice/manual-deposit`, obj)
                    .map((data: any) => (data.data || data))
                    .subscribe((data) => {
                            if (data.code == 0) {

                               alert('ทำรายการสำเร็จ');
                                this.onLoad();
                                this.clear();

                            } else {
                                if(data.code === 1005 || data.code === 1003){
                                    alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                    this.router.navigate(['/login']);
                                }else{
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
            } else {

                let obj = {
                    customer_account: this.formManual.username,
                    amount: this.formManual.value,
                    description: this.formManual.remark
                }

                this.http.post(`${this.settings.getAppSetting('url')}/backoffice/manual-withdraw`, obj)
                    .map((data: any) => (data.data || data))
                    .subscribe((data) => {
                            if (data.code == 0) {

                                alert('ทำรายการสำเร็จ');
                                this.onLoad();
                                this.clear()

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
        }
    }


    clear(){
        this.formManual = {
            username: '',
            value: 0,
            type: 'MANUALDEPOSIT',
            remark: '',
            agentType: 0
        };
    }
}
