import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import * as moment from 'moment';

@Component({
    selector: '[withdraw-report]',
    templateUrl: './withdraw-report.html',
    styleUrls: [ './withdraw-report.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class WithdrawReport implements OnInit{

    startDate: Date = null;
    endDate: Date = null;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };

    agType : any = [];
    agentType : number = 0;
    private username : string = '';
    public paginationConfig  = { itemsPerPage: 50, currentPage: 1, totalItems: 0,id: 'page' };
    private reports : any = [];
    private slip: string = '';
    private status = 'ALL';
    private banks : any = [];
    private summary : any = 0;
    private summaryReal : any = 0;
    private count: any = 0;
    private summaryTrans: any = 0;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {

        if(this.setting.getPosition() === 'LOW_ADMIN'){
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
        this.interval();
        this.getAgentType();
    }

    pageChange(e:any){
        console.log('Event next page ====> ', e);
        this.paginationConfig.currentPage = e;
        this.onLoad();
    }

    getAgentType(){


        this.http.get(`${this.setting.getAppSetting('url')}/home/agentType`)
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

    interval(){
        setTimeout(()=>{
            if(this.router.url === '/app/withdraw-report'){
                let obj = {
                    startDate: this.startDate ,
                    endDate: this.endDate,
                    username: this.username,
                    agentType: parseInt(this.agentType),
                    page: this.paginationConfig.currentPage,
                    limit: this.paginationConfig.itemsPerPage,
                    status: this.status
                };

                this.http.post(`${this.setting.getAppSetting('url')}/report/withdraw`, obj)
                    .subscribe(response => {
                        console.log(response)
                        if (response.code == 0) {
                            this.reports = response.result.list;
                            this.paginationConfig.totalItems = response.result.total;
                            this.count = response.result.totalCount;
                            this.summaryTrans = response.result.totalCount;
                            this.summary = response.result.summary;
                            this.summaryReal = response.result.summaryReal;
                            this.banks = response.result.banks;

                            this.interval();
                        } else {
                            if(response.code === 1005 || response.code === 1003){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            }
                        }
                    });
            }
        }, 10000)
    }

    onLoad(){

        let obj = {
            startDate: this.startDate ,
            endDate: this.endDate,
            username: this.username,
            agentType: parseInt(this.agentType),
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage,
            status: this.status
        };

        this.http.post(`${this.setting.getAppSetting('url')}/report/withdraw`, obj)
            .subscribe(response => {
                console.log(response)
                if (response.code == 0) {
                    this.reports = response.result.list;
                    this.paginationConfig.totalItems = response.result.total;
                    this.count = response.result.totalCount;
                    this.summaryTrans = response.result.totalCount;
                    this.summary = response.result.summary;
                    this.summaryReal = response.result.summaryReal;
                    this.banks = response.result.banks;
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });
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

        this.paginationConfig.currentPage = 1;

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

        this.paginationConfig.currentPage = 1;

        this.onLoad();
    }

    viewRemark(text){
        alert(text)
    }

    reset(id){
        if(confirm('คุณต้องการรีเซตรายการถอนใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/withdraw/reset`, {id: id})
                .subscribe(response => {
                    console.log(response)
                    if (response.code == 0) {
                        alert(response.message)
                        this.ngOnInit();
                    } else {
                        if(response.code === 1005 || response.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }
                });
        }
    }

    manual(id){
        if(confirm('คุณต้องการถอนมือใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/withdraw/manual`, {id: id})
                .subscribe(response => {
                    console.log(response)
                    if (response.code == 0) {
                        alert(response.message)
                        this.ngOnInit();
                    } else {
                        if(response.code === 1005 || response.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }
                });
        }
    }

    approve(id){
        if(confirm('คุณต้องการอนุมัติใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/withdraw/approve`, {id: id})
                .subscribe(response => {
                    console.log(response)
                    if (response.code == 0) {
                        alert(response.message)
                        this.ngOnInit();
                    } else {
                        if(response.code === 1005 || response.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }
                });
        }
    }

    reject(id){
        if(confirm('คุณต้องการยกเลิกรายการถอนใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/withdraw/reject`, {id: id})
                .subscribe(response => {
                    console.log(response)
                    if (response.code == 0) {
                        alert(response.message)
                        this.ngOnInit();
                    } else {
                        if(response.code === 1005 || response.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }
                });
        }
    }

    cancel(id){
        if(confirm('คุณต้องการปฏิเสธรายการถอนใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/withdraw/cancel`, {id: id})
                .subscribe(response => {
                    if (response.code == 0) {
                        alert(response.message)
                        this.ngOnInit();
                    } else {
                        if(response.code === 1005 || response.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        } else {
                            this.ngOnInit();
                        }
                    }
                });
        }
    }

    viewSlop(img){

        this.slip = img;
        jQuery('#slipModal').modal();
    }
}