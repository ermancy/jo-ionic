import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

// We MUST import both the firebase AND firestore modules like so
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {

	private _DB : any;

	constructor(public http: HttpClient)
	{
		// Initialise access to the firestore service
		this._DB = firebase.firestore();
	}

	createAndPopulateDocument(	collectionObj	: string,
								docID			: string,
								dataObj			: any ) : Promise<any>
	{
		return new Promise((resolve, reject) =>
		{
			this._DB
			.collection(collectionObj)
			.doc(docID)
			.set(dataObj, { merge: true })
			.then((data : any) =>
			{
				resolve(data);
			})
			.catch((error : any) =>
			{
				reject(error);
			});
		});
	}

	getDocuments(collectionObj : string) : Promise<any>
	{
		return new Promise((resolve, reject) => {
			this._DB.collection(collectionObj)
			.get()
			.then((querySnapshot) => {
				// Declare an array which we'll use to store retrieved documents
				let obj : any = [];

				// Iterate through each document, retrieve the values for each field
				// and then assign these to a key in an object that is pushed into the
				// obj array
				querySnapshot
				.forEach((doc : any) => {
					obj.push({
						id             : doc.id,
						city           : doc.data().city,
						population     : doc.data().population,
						established    : doc.data().established,
					
					
//						owner                   : doc.currentUser.email,
//						jobOrderDate            : doc.Date.now(),
//						jobOrderDateDesc        : doc.dateDesc,
//						jobOrderNo              : doc.jobOrderNo,
//						customerName            : doc.customerName,
//						orderType               : doc.orderType,
//						orderSize               : doc.orderSize,
//						jobCount                : doc.jobCount,
//						printMachine            : doc.printMachine,
//						plateType               : doc.plateType,
//						binding                 : doc.binding,
//						notes                   : doc.notes,
//						customerRep             : doc.customerRep,
//						paperWeight             : doc.paperWeight,
//						paperType               : doc.paperType,
//						paperSize               : doc.paperSize,
//						printSize               : doc.printSize,
//						printCount              : doc.printCount,
//						actualCount             : doc.actualCount,
//						leafCount               : doc.leafCount,
//						pageCount               : doc.pageCount,
//						colorCount              : doc.colorCount,
//						postApplication         : doc.postApplication,
//						coverPaperWeight        : doc.coverPaperWeight,
//						coverPaperType          : doc.coverPaperType,
//						coverPaperSize          : doc.coverPaperSize,
//						coverPrintSize          : doc.coverPrintSize,
//						coverPrintCount         : doc.coverPrintCount,
//						coverActualCount        : doc.coverActualCount,
//						coverLeafCount          : doc.coverLeafCount,
//						coverPageCount          : doc.coverPageCount,
//						coverColorCount         : doc.coverColorCount,
//						coverPostApplication    : doc.coverPostApplication
					});
				});

				// Resolve the completed array that contains all of the formatted data
				// from the retrieved documents
				resolve(obj);
			})
			.catch((error : any) => {
				reject(error);
			});
		});
	}
	
	addDocument(	collectionObj	: string,
					dataObj			: any ) : Promise<any>
	{
		return new Promise((resolve, reject) =>	{
			this._DB.collection(collectionObj).add(dataObj)
			.then((obj : any) =>
			{
				resolve(obj);
			})
			.catch((error : any) =>
			{
				reject(error);
			});
		});
	}

	deleteDocument(	collectionObj	: string,
					docID			: string ) : Promise<any>
	{
		return new Promise((resolve, reject) =>	{
			this._DB
			.collection(collectionObj)
			.doc(docID)
			.delete()
			.then((obj : any) =>
			{
			   resolve(obj);
			})
			.catch((error : any) =>
			{
			   reject(error);
			});
		});
	}

	updateDocument(	collectionObj	: string,
					docID			: string,
					dataObj			: any ) : Promise<any>
	{
		return new Promise((resolve, reject) =>	{
			this._DB
			.collection(collectionObj)
			.doc(docID)
			.update(dataObj)
			.then((obj : any) =>
			{
				resolve(obj);
			})
			.catch((error : any) =>
			{
				reject(error);
			});
		});
	}
}
