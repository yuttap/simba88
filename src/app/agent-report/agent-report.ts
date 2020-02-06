import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import * as moment from 'moment';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
    selector: '[agent]',
    templateUrl: './agent-report.html',
    styleUrls: [ './agent-report.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class AgentReport implements OnInit{

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
    private agentType : string = '';
    private position : string = '';

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {

        if(this.setting.getPosition() !== 'J_14'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/login']);
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
                    let agentType = response.result;

                    this.agType = [];

                    let at = JSON.parse(localStorage.getItem('profile')).agentType;
                    // let at = [1,2];
                    at.forEach((a)=>{
                        let xx = agentType.filter((t)=>{
                            console.log(t.index, a);
                            return t.index === a
                        });

                        if(xx.length > 0){
                            this.agType.push(xx[0])
                        }
                    })

                    if(this.agType.length === 1){
                        this.agentType = this.agType[0].index;
                    }


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
            agentType: this.agentType ? this.agentType : JSON.parse(localStorage.getItem('profile')).agentType,
            sortingType: this.sortingType,
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage
        }


        this.totalData = [];
        this.http.post(`${this.setting.getAppSetting('url')}/report/agent`, obj)
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