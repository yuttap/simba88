import {Injectable} from '@angular/core';
declare var $: any;

@Injectable()
export class SettingsService {

    private app: any;
    public layout: any;

    constructor() {
        this.app = {
            url: 'http://128.199.222.93:3000/v1',
            url_image: 'http://cdn.niyomsiam.com',
            widthIcon: 320,
            heightIcon: 240,
            widthBanner: 320,
            heightBanner: 240
        };
    }

    getAppSetting(name:string) {
        return name ? this.app[name] : this.app;
    }

    setAppSetting(name:string, value:string) {
        if (typeof this.app[name] !== 'undefined') {
            this.app[name] = value;
        }
    }

    getPosition(){
        return JSON.parse(localStorage.getItem('profile')).position;
    }
}
