import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	private UseName:string;
	private Password:string;
	public apiUrl = "http://plutokmdev.com/apiservices/vendor_api.php";
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public Http: Http, 
		public Storage: Storage, 
		public alrtCntrl:ToastController) 
	{

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	loginUser() {
		let headers = new Headers;
		headers.append('Content-type', 'application/json');
		let reqParams = JSON.stringify({'action':'login','UserName':this.UseName,'Password':this.Password});
		return this.Http.post(this.apiUrl,reqParams, { headers: headers})
		.map(response => response.json())
		.subscribe(data => {
			console.log(data);
			if(data.success == 0) {
				this.presentToast(data.data);
			}
			if(data.success == 1) {
				this.Storage.set('vendor_id',data.data.vid);
				this.Storage.set('vendor_decode',data.data.vendorDcode);
				this.Storage.set('vendor_state',data.data.vendorStateRef);
				this.navCtrl.setRoot('HomePage');
			}
		});
	}

	presentToast(message,position='top') {
	    let toast = this.alrtCntrl.create({
	      message: message,
	      duration: 3000,
	      position: position,
	      closeButtonText:'OK',
	      showCloseButton:true
	    });
	    toast.present();
	}

}
