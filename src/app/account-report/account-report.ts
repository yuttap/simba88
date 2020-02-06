import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import * as moment from 'moment';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
    selector: '[account]',
    templateUrl: './account-report.html',
    styleUrls: [ './account-report.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class AccountReport implements OnInit{

    public users : any = [];
    startDate: Date = null;
    endDate: Date = null;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };

    private username : string = '';
    public paginationConfig  = { itemsPerPage: 50, currentPage: 1, totalItems: 0,id: 'page' };
    @ViewChild('topupModal') public topupModal:ModalDirective;
    @ViewChild('withdrawModal') public withdrawModal:ModalDirective;
    @ViewChild('accountModal') public accountModal:ModalDirective;

    private topUpReports : any = [];
    private withdrawReports : any = [];
    private userDetail : any = {};
    private sortingType: string = '';
    private totalData : any = [];
    private agType : any = [];
    private agentType : number = 0;
    private position : string = '';
    private username: string = '';

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {

        if(this.setting.getPosition() !== 'SUPER_ADMIN'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/app/home']);
        }

        this.position = this.setting.getPosition();

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
            agentType: parseInt(this.agentType),
            username: this.username,
            sortingType: this.sortingType,
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage
        }


        this.totalData = [];
        this.http.post(`${this.setting.getAppSetting('url')}/report/customer`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    console.log(response )
                    this.users = response.result;

                    this.paginationConfig.totalItems = response.totalRecord;
                    this.totalData.totalRecord = response.totalRecord;
                    this.totalData.totalDeposit = response.totalDeposit;
                    this.totalData.totalDepositTran = response.totalDepositTran;
                    this.totalData.totalWithdraw = response.totalWithdraw;
                    this.totalData.totalWithdrawTran = response.totalWithdrawTran;
                    this.totalData.totalWL = response.totalWL;
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