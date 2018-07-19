import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage({
	name: "manage-document"
})
@Component({
	selector: 'page-manage-document',
	templateUrl: 'manage-document.html',
})

export class ManageDocumentPage {

	public form			: any;

	public records		: any;
	public city			: string	= '';
	public population	: string	= '';
	public established	: string	= '';
	public docID		: string	= '';
	public isEditable	: boolean	= false;
	public title		: string	= 'Yeni Kayıt Ekle';
	private _COLL		: string	= "Job Orders";


	constructor(	public navCtrl	: NavController,
					public params	: NavParams,
					private _FB		: FormBuilder,
					private _DB		: DatabaseProvider,
					private _ALERT	: AlertController ){

		this.form 		= _FB.group({
			'city'			: ['', Validators.required],
			'population'	: ['', Validators.required],
			'established'	: ['', Validators.required]
		});

		if(params.get('isEdited')){
			let record			= params.get('record');

			this.city			= record.location.city;
			this.population		= record.location.population;
			this.established	= record.location.established;
			this.docID			= record.location.id;
			this.isEditable		= true;
			this.title			= 'Kayıt Düzenleme';
		}
	}

	saveDocument(val : any) : void
	{
		let city	: string = this.form.controls["city"].value,
	 	population	: string = this.form.controls["population"].value,
		established	: string = this.form.controls["established"].value;

		// If we are editing an existing record then handle this scenario
		if(this.isEditable)
		{
			// Call the DatabaseProvider service and pass/format the data for use
			// with the updateDocument method
			this._DB.updateDocument(
				this._COLL,
				this.docID,
				{
					city		: city,
					population	: population,
					established	: established
				})
				.then((data) => {
					this.clearForm();
					this.displayAlert('Başardın', 'Kayıt no ' +  city + ' olan iş emri güncellendi');
				})
				.catch((error) =>
				{
				   this.displayAlert('Kayıt güncelleme başarısız.', error.message);
				});
		}

		// Otherwise we are adding a new record
		else
		{
			// Call the DatabaseProvider service and pass/format the data for use
			// with the addDocument method
			this._DB.addDocument(this._COLL,
				{
					city		: city,
					population	: population,
					established	: established
				})
			.then((data) => {
				this.clearForm();
				this.displayAlert('Tebrikler', 'Kayıt no ' +  city + ' olan iş emri eklendi.');
			})
			.catch((error) => {
				this.displayAlert('Kayıt ekleme başarısız.', error.message);
			});
		}
	}

	displayAlert(	title	: string,
					message	: string ) : void
	{
		let alert : any = this._ALERT.create({
			title		: title,
			subTitle	: message,
			buttons		: ['Tamamdır!']
		});
		alert.present();
	}

	clearForm() : void
	{
		this.city			= '';
		this.population		= '';
		this.established	= '';
	}
}
