import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import * as moment from 'moment';

@Component({
    selector: '[deposit]',
    templateUrl: './deposit-report.html',
    styleUrls: [ './deposit-report.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class DepositReport implements OnInit{

    startDate: Date = null;
    endDate: Date = null;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };
    agType : any = [];
    isAuto : any = null;
    optAuto : any = ['All', 'Auto', 'Manual'];
    agentType : number = 0;

    private username : string = '';
    public paginationConfig  = { itemsPerPage: 50, currentPage: 1, totalItems: 0,id: 'page' };
    private reports : any = [];
    private summary: any = [];
    private summaryTrans: any = 0;
    private summaryTotal: any = 0;
    private summaryBonus : any = 0;
    private topupTotal = 0;
    private bonusTotal = 0;
    private resultBonus: any = [];
    private prefix : any = 'ALL';
    private typeTransaction: any  = null;
    private typeshow: string = 'All';

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
        this.getAgentType();
    }

    pageChange(e:any){
        console.log('Event next page ====> ', e);
        this.paginationConfig.currentPage = e;
        this.onLoad();
    }

    autoChange(event){
        if(event.target.value == 'Auto'){
            this.isAuto = true
        }else if(event.target.value == 'Manual'){
            this.isAuto = false
        }else{
            this.isAuto = null
        }

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

    onLoad(){
        let obj = {
            startDate: this.startDate ,
            endDate: this.endDate,
            username: this.username,
            agentType: parseInt(this.agentType),
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage
        };

        if(this.isAuto !== null){
            obj.isAuto = this.isAuto
        }

        this.http.post(`${this.setting.getAppSetting('url')}/report/transactionDeposit`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    this.reports = response.result.list;
                    this.summary = response.result.summary;
                    this.typeTransaction = response.result.typeTransaction;
                    this.paginationConfig.totalItems = response.result.total;
                    if (this.summary) {
                        this.summaryTrans = 0;
                        this.summaryTotal = 0;
                        this.summaryBonus = 0;
                        for (let i = 0; i < this.summary.length; i++) {
                            this.summaryTrans += response.result.summary[i].count;
                            this.summaryTotal += response.result.summary[i].summary;
                            this.summaryBonus += response.result.summary[i].summaryBonus;
                        }
                    }
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });

        this.topupTotal = 0;
        this.bonusTotal = 0;
        this.resultBonus = [];

        let body = {
            startDate: this.startDate,
            endDate: this.endDate,
            agentType: parseInt(this.agentType)
        };

        this.http.post(`${this.setting.getAppSetting('url')}/report/userReport`, body)
            .subscribe(response => {
                if (response.code == 0) {
                    if (response.code == 0) {
                        this.resultBonus = response.result;
                    } else {
                        alert(response.message);
                    }
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
}