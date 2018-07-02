import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
declare var $:any;
@Component({
  selector: 'app-main-wms-login',
  templateUrl: './main-wms-login.component.html',
  styleUrls: ['./main-wms-login.component.css']
})
export class MainWmsLoginComponent implements OnInit {
  constructor(private router: Router, private appServices: AppServices, private notifyService: NotifyService) { }
  ngOnInit() {
  }
  signinWMS(data) {
    this.appServices.signinUsers({'obj': JSON.stringify({"username": data.username, "password": data.password})}, this).then(function(__){
      let rs = __.response.json().res;
      __.component.appServices.getApps({'obj': JSON.stringify({'token': rs.token.id, 'username': rs.token.uid, 'deleted': false, 'appcode': 'wms' })}, this).then(function(obj){
        if(obj.response.json().res.length > 0){
          window.location.href = obj.response.json().res[0].url + __.response.json().res.token.id;
        } else {
          __.component.notifyService.show('User has no access permissions!', 'danger');
        }
      }).catch(function(err){
        __.component.notifyService.show(typeof err.err === 'undefined' ? 'An unknown Error' : err.err.json().error.message, 'danger');
      })
    }).catch((err)=>{
      this.notifyService.show(typeof err.err === 'undefined' ? 'An unknown Error' : err.err.json().error.message, 'danger');
    })
  }
  forgotPasswordWMSData(data){
    this.appServices.forgotPasswordUsers({'obj': JSON.stringify({'appcode': 'wms','username': data.username, 'email': data.email, 'editwho': 'system'})}, this).then(function(__){
      __.component.notifyService.show('Process Done! <br/> Check your mail, you will receive an email including a new password from Smartlog System');
      $('#modalforgotPasswordUsers').modal('hide');
    }).catch((err)=>{
      this.notifyService.show(typeof err.err === 'undefined' ? 'An unknown Error' : err.err.json().error.message, 'danger');
    })
  }
}