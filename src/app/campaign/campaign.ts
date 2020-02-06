import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
import { FormControl, FormGroup } from '@angular/forms';

declare let jQuery: any;
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: '[campaign]',
    templateUrl: './campaign.html',
    styleUrls: [ './campaign.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class Campaign implements OnInit{

    public campaigns : any = [];
    @ViewChild('campaignModal') public campaignModal:ModalDirective;
    @ViewChild('twoFactoryModal') public twoFactoryModal:ModalDirective;
    public campaignDetail: any = {}
    public _id: string;
    public campaignName: string;
    public condition: any = []
    public type: string = null;
    public typeBonus: string = null;
    public maxBonus: any;
    public startTime: any;
    public endTime: any;
    public active: boolean;
    public action: string;
    public key1: any = [];

    public cnt: number = 0;
    private isJAdmin : boolean = false;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 @Inject(DOCUMENT) private document: any,
                 private setting: SettingsService) {

        if(this.document.location.hostname.includes('890') || this.document.location.hostname.includes('ufrr41')){
            this.isJAdmin = true;
        }

        if(this.setting.getPosition() !== 'SUPER_ADMIN' && this.setting.getPosition() !== 'SECURITY'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/app/home']);

        }
    }

    ngOnInit() {
        this.onLoad();
    }


    onLoad(){

        this.http.get(`${this.setting.getAppSetting('url')}/campaign`)
            .subscribe(response => {
                if (response.code == 0) {
                    this.campaigns = response.result;
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });
    }


    openModal(action, id){
        this.action = action;
        this.cleanData()

        if(action === 'EDIT'){
            this.loadDetail(id);
        } else {
            this.active = true
            jQuery('#campaignModal').modal({backdrop: 'static', keyboard: false});
        }
    }


    loadDetail(id){
        this.http.get(`${this.setting.getAppSetting('url')}/campaign/${id}`)
            .subscribe(response => {
                if (response.code == 0) {
                    const result = response.result[0]

                    this._id = result._id
                    this.campaignName = result.campaignName
                    this.type = result.type
                    this.typeBonus = result.typeBonus
                    this.condition = result.condition
                    this.maxBonus = result.maxBonus
                    this.startTime = result.startTime
                    this.endTime = result.endTime
                    this.active = result.active
                    this.customeUI()
                    jQuery('#campaignModal').modal({backdrop: 'static', keyboard: false});
                } else {

                }
            });
    }

    cleanData(){
        this._id = null;
        this.campaignName = null;
        this.type = "";
        this.typeBonus = "";
        this.condition = [];
        this.maxBonus = null;
        this.startTime = null;
        this.endTime = null;
        this.active = null;
    }


    customeUI(){
        if(this.type == 'TIER'){
            $("#addCondition").show()
            $("#customTime").hide()
            $("#customCondition").show()

        }else if(this.type == 'BONUS_TIME'){
            $("#addCondition").show()
            $("#customTime").show()
            $("#customCondition").show()
        }
    }

    addCondition(){
        this.condition.push({"key1":"", "key2":"", "bonus":""})
    }

    removeCondition(event, index){
        $(event.target).closest(".customui").remove()
        delete this.condition[index]
        this.condition  = this.condition.filter((m)=> m.key1 !== undefined)
    }

    onSubmit(form){
        form.type = this.type
        form.typeBonus = this.typeBonus
        form.condition = this.condition
        if(this.action == 'ADD') {
            this.http.post(`${this.setting.getAppSetting('url')}/campaign/add`, form)
                .subscribe(response => {
                    if (response.code == 0) {
                        alert(response.message);

                        this.cleanData()
                        this.onLoad();
                        jQuery('#campaignModal').modal("hide");
                    } else {
                        alert(response.message);
                    }
                });

        }else if(this.action == 'EDIT'){

            this.http.put(`${this.setting.getAppSetting('url')}/campaign/update/${this._id}`, form)
                .subscribe(response => {
                    if (response.code == 0) {
                        alert(response.message);

                        this.cleanData()
                        this.onLoad();
                        jQuery('#campaignModal').modal("hide");
                    } else {
                        alert(response.message);
                    }
                });
        }
    }



}