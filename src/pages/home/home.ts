import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	private _COLL 		: string = "Job Orders";
	private _DOC 		: string = "ilk-doküman";
	private _CONTENT	: any;
	public locations	: any;

	constructor(	public navCtrl	: NavController,
					private _DB		: DatabaseProvider,
					private _ALERT	: AlertController)
	{
		this._CONTENT = {
			city		: "İstanbul",
			population	: "18,787,892",
			established	: "1453 MS"
		};
	}

	ionViewDidEnter(){
		this.retrieveCollection();
	}

	 generateCollectionAndDocument() : void {
		this._DB.createAndPopulateDocument(	this._COLL,
											this._DOC,
											this._CONTENT )
		.then((data : any) => {
			console.dir(data);
		})
		.catch((error : any) => {
			console.dir(error);
		});
	}

	retrieveCollection() : void
	{
		this._DB.getDocuments(this._COLL)
		.then((data) =>
		{	
			// IF we don't have any documents then the collection doesn't exist
			// so we create it!
			if(data.length === 0)
			{
				this.generateCollectionAndDocument();
			}	
			// Otherwise the collection does exist and we assign the returned
			// documents to the public property of locations so this can be
			// iterated through in the component template
			else
			{
				this.locations = data;
			}
		})
		.catch();
	}

	addDocument() : void {
		this.navCtrl.push('manage-document');
	}

	updateDocument(obj) : void {
		let params : any = {
			collection	: this._COLL,
			location	: obj
		};
		this.navCtrl.push('manage-document', { record : params, isEdited : true });
	}

	deleteDocument(obj) : void
	{
		this._DB.deleteDocument(	this._COLL,
									obj.id)
		.then((data : any) => {
			this.displayAlert('Başardın!', 'Kayıt numarası ' + obj.city + ' olan iş emri silindi.');
		})
		.catch((error : any) => {
			this.displayAlert('Hata', error.message);
		});
	}

	displayAlert(	title      : string,
					message    : string) : void {
		let alert : any     = this._ALERT.create({
			title      : title,
			subTitle   : message,
			buttons    : [{
				text      : 'Tamamdır!',
				handler   : () => {
					this.retrieveCollection();
				}
			}]
		});
		alert.present();
	}
}
