import {Injectable} from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import { UserService } from '../_services';

export class UploadResponse{

    code:number;
    message:string;
    results:Object;

    constructor(code :number,message:string,results:Object){
        this.code = code;
        this.message = message;
        this.results = results;
    }

    getCode(){
        return this.code;
    }

}


@Injectable()
export class UploadService {

    URL_SINGLE_UPLOAD :string;
    URL_MULTI_UPLOAD :string;

    constructor(private setting: SettingsService,private userService: UserService) {
        // initially visible
        this.URL_SINGLE_UPLOAD = this.setting.getAppSetting('url') + '/upload/single';
        this.URL_MULTI_UPLOAD  = this.setting.getAppSetting('url') + '/upload/multi';
    }


    uploadFile(category,file:File,pathName,w,h) :any {
        return new Promise((resolve, reject) => {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();
            formData.append('category',category);
            formData.append('file',file)
            formData.append('pathName',pathName)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", `${this.URL_SINGLE_UPLOAD}?width=${w}&height=${h}`, true);
            xhr.setRequestHeader('Authorization','Bearer '+this.userService.getToken())
            xhr.send(formData);
        });
    }

    uploadFiles(category,files:Array<File>,pathName,w,h) : any{
        return new Promise((resolve, reject) => {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();
            formData.append('category',category);
            formData.append('pathName',pathName)
            for(let i = 0; i < files.length; i++) {
                formData.append("files", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                        // resolve(new UploadResponse(xhr.response.code,xhr.response.message,xhr.response.results));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", `${this.URL_MULTI_UPLOAD}?width=${w}&height=${h}`, true);
            xhr.setRequestHeader('Authorization','Bearer '+this.userService.getToken())
            xhr.send(formData);
        });
    }

}
