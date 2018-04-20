import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

	public vendor_id:number;
	public vendor_decode:string;
	public vendor_state:number;

	public loopInvoices:any;


	public InvoicesData:Array<any> = [];
	public apiUrl = "http://plutokmdev.com/apiservices/vendor_api.php";

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public Http: Http, 
		public Storage: Storage,
		public alrtCntrl:ToastController)
	{

		this.Storage.get('vendor_id').then((val) => {
		    this.vendor_id = val;
		    return this.Storage.get('vendor_decode'); 
		}).then((val) => {
		    this.vendor_decode = val;
		    return this.Storage.get('vendor_state'); 
		}).then((val) => {
		    this.vendor_state = val;
			if( !this.vendor_id || !this.vendor_decode || !this.vendor_state ) {
				this.navCtrl.setRoot('LoginPage');
			}
			this.getVendorInvoices();
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
	}


	getVendorInvoices() {
		let headers = new Headers;
		headers.append('Content-type', 'application/json');

		let reqParams = JSON.stringify({'action':'getAllInvoices','vendor_id':this.vendor_id});
		
		return this.Http.post(this.apiUrl,reqParams, { headers: headers})
		.map(response => response.json())
		.subscribe(data => {
			if(data.success == 0) {
				this.presentToast(data.data);
				return;
			}

			let result = this.generateArray(data.data);;
			setTimeout(function(){
				this.InvoicesData = result;
				console.log(this.InvoiceData);
			},200);
		});
	}


	generateArray(obj) {
		return Object.keys(obj).map((key)=>{ return obj[key]});
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
