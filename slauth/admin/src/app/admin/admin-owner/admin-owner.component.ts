import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../auth/auth.service';
declare var $:any;
@Component({
  selector: 'app-admin-owner',
  templateUrl: './admin-owner.component.html',
  styleUrls: ['./admin-owner.component.css']
})
export class AdminOwnerComponent implements OnInit {
  data_owner = []; delete_owner = []; selected_owner; currentPage_owner = 1; itemsPerPage_owner = 5; total_owner = 0; data_itemsPerPage = [];
  data_warehouse = []; data_parentuser = [];
  selected_lottable;
  data_lottable = JSON.parse(`{"lottable01":{"datatype": "string","label": "lottable01", "active": true},"lottable02":{"datatype": "string","label": "lottable02", "active": true},"lottable03":{"datatype": "string","label": "lottable03", "active": true},"lottable04":{"datatype": "date","label": "lottable04", "active": true},"lottable05":{"datatype": "date","label": "lottable05", "active": true},"lottable06":{"datatype": "string","label": "lottable06", "active": true},"lottable07":{"datatype": "string","label": "lottable07", "active": true},"lottable08":{"datatype": "string","label": "lottable08", "active": true},"lottable09":{"datatype": "string","label": "lottable09", "active": true},"lottable10":{"datatype": "string","label": "lottable10", "active": true},"lottable11":{"datatype": "date","label": "lottable11", "active": true},"lottable12":{"datatype": "date","label": "lottable12", "active": true}}`);
  f_warehousecode = ''; f_storerkey = ''; f_company = ''; f_address = ''; f_parentuser = '';
  propertyName ; order = 'ASC';

  constructor(private router: Router, private appServices: AppServices, private notifyService: NotifyService, private authService: AuthService) {
    this.itemsPerPage_owner = this.appServices.session.paginate ?  this.appServices.session.paginate[0].short : 12 ;
  }
  ngOnInit() {
    this.loadOwnerData();
    this.loadParentUserData();
  }
  loadOwnerData(param = '') {
    let skip = (this.currentPage_owner-1)*this.itemsPerPage_owner;
    let limit = this.itemsPerPage_owner;
    this.delete_owner = [];
    let filter;
    if(param) {
      if(this.f_warehousecode.length > 0) filter = $.extend(filter, {'warehousecode': {like: this.f_warehousecode}});
      if(this.f_storerkey.length > 0) filter = $.extend(filter, {'storerkey': {like: this.f_storerkey}});
      if(this.f_company.length > 0) filter = $.extend(filter, {'company': {like: this.f_company}});
      if(this.f_address.length > 0) filter = $.extend(filter, {'address': {like: this.f_address}});
      if(this.f_parentuser.length > 0) filter = $.extend(filter, {'parentuser': {like: this.f_parentuser}});
    }

    this.appServices.isSysUsers({'obj': JSON.stringify({'where': {'username': this.appServices.session.token.uid,'deleted': false}})}, this)
    .then(function(__){
      let response = __.response.json();
      let where = response.res > 0 ? {'deleted': false, 'type': '1'} : {'parentuser': __.component.appServices.session.token.uid, 'deleted': false, 'type': '1'};
      __.component.appServices.findStorer({'filter': JSON.stringify({'where': $.extend(where, filter), 'skip': skip, 'limit': limit, 'order': __.component.propertyName ? __.component.propertyName + " " + __.component.order : null})}, this)
      .then(function(obj){
        let json = obj.response.json();
        __.component.data_owner = json.res;
        __.component.total_owner = json.total;
      }).catch(function(err){
        __.component.authService.catchErr(err);
      })
    }).catch((err)=>{
      this.authService.catchErr(err);
    })
  }

  loadParentUserData() {
    this.appServices.findUsers({'filter': JSON.stringify({'where': {'parentuser': '', 'deleted': false, 'type': 1}})}, this)
    .then(function(__){
      __.component.data_parentuser = __.response.json().res;
    }).catch((err)=>{
      this.authService.catchErr(err);
    })
  }

  loadWarehouseData(parentuser) {
    this.appServices.findWarehouse({'filter': JSON.stringify({'where': {'deleted': false, 'parentuser': parentuser}})}, this)
    .then(function(__){
      __.component.data_warehouse = __.response.json().res;
    }).catch((err)=>{
      this.authService.catchErr(err);
    })
  }

  insertOwnerData(data) {
    data['currentuser'] = this.appServices.session.token.uid;
    data['type'] = '1';
    data['parentuser'] = data['parentuser']?data['parentuser']:(this.appServices.session.isAdmin?'':this.appServices.session.token.uid);
    this.appServices.insertStorer({'obj': JSON.stringify(data)}, this).then(function(__){
      __.component.notifyService.show('Process Done');
      __.component.loadOwnerData();
    }).catch((err)=>{
      this.authService.catchErr(err);
    })
  }

  updateOwnerData(data) {
    data['currentuser'] = this.appServices.session.token.uid;
    data['deleted'] = false;
    data['type'] = '1';
    data['parentuser'] = data['parentuser']?data['parentuser']:(this.appServices.session.isAdmin?'':this.appServices.session.token.uid);
    data['lottable'] = Object.assign({}, this.selected_lottable);
    this.appServices.updateStorer({'obj': JSON.stringify(data)}, this).then(function(__){
      __.component.notifyService.show('Process Done');
      __.component.selected_lottable = data.lottable;
      __.component.loadOwnerData();
    }).catch((err)=>{
      this.authService.catchErr(err);
    })
  }
  onChoose(e, data){
    if(e.target.checked) {
      this.delete_owner.push(data);
    }
    else {
      let index = this.delete_owner.indexOf(data);
      this.delete_owner.splice(index, 1);
    }
  }
  findOwnerData(data){
    this.selected_owner = Object.assign({}, data);
    this.loadWarehouseData(this.selected_owner.parentuser);
    this.selected_lottable = JSON.parse(this.selected_owner.lottable);
  }
  deleteOwnerData(){
    this.delete_owner.forEach((value, index, arr) => {
      value['deleted'] = true;
      value['currentuser'] = this.appServices.session.token.uid;
      this.appServices.updateStorer({'obj': JSON.stringify(value)}, this).then(function(__){
        __.component.notifyService.show('Process Done');
        __.component.loadOwnerData();
        $('#modalDelete').modal('hide');
      }).catch((err)=>{
        this.authService.catchErr(err);
      })
    })
  }
  checkAll(e) {
    if(e.srcElement.checked){
      this.data_owner.forEach(curr_data=>{
        curr_data.state = e.target.checked;
        if(!this.delete_owner.includes(curr_data)){
          this.delete_owner.push(curr_data);
        }
      })
    } else {
      this.data_owner.forEach(x=>x.state = e.target.checked);
      this.delete_owner = [];
    }
  }
  isAllChecked() {
    return this.data_owner.every(_ => _.state);
  }
}
