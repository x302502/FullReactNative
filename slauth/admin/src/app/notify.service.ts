import { Injectable } from '@angular/core';

declare var $:any;

@Injectable()
export class NotifyService {

  constructor() { }

  show(message, type = 'info', icon = 'fa fa-info-circle', title = '', url = '') {
    $.notify({
      title: title,
      message: message,
      icon: icon,
      url: url
    },{
      allow_dismiss: false,
      showProgressbar: false,
      type: type,
      placement: {
				from: "bottom",
				align: "right"
			}
    });
  }

}
