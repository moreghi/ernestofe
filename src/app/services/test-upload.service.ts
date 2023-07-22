// test -- solo per verificare la funzione di upload  (utilizzato in testupload.component)


import {  HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestUploadService {

  private baseUrl = environment.APIURL;   //'http://localhost:8080';
  private rotta = '/upload';
  private rottafunction = '/folder';
  private apiUrl = '';
  private folder = 'eventos_locandina';


  constructor(
    private http: HttpClient

  ) { }

  public uploadfile(file: File) {

    const formData: FormData = new FormData();


   // let formParams = new FormData();
   // formParams.append('file', file)

   // return this.httpClient.post('http://localhost:3001/uploadFile', formParams)


    console.log('.....................  uploadFileService - upload - file: ' + JSON.stringify(file));



    this.apiUrl = this.baseUrl  + this.rotta + this.rottafunction + '/' + this.folder;
    console.log('......... url per Upload ............  uploadFileService - upload - url: ' + this.apiUrl);
    formData.append('file', file);

   const req = new HttpRequest('POST', this.apiUrl, formData, {


    //  const req = new HttpRequest('POST', `${this.baseUrl}/upload/folder/ ${folder}`, formData, {   originale
        reportProgress: true,
        responseType: 'json'
      });

      return this.http.request(req);


  }
}
