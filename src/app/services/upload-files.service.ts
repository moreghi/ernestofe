import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = environment.APIURL;   //'http://localhost:8080';
  private rotta = '/upload';
  private rottafunction = '/folder';
  private apiUrl = '';



  constructor(private http: HttpClient) { }

  upload(file: File, folder: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    console.log('.....................  uploadFileService - upload - file: ' + JSON.stringify(file));
    this.apiUrl = this.baseUrl  + this.rotta + this.rottafunction + '/' + folder;
    console.log('......... url per Upload ............  uploadFileService - upload - url: ' + this.apiUrl);
    formData.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl, formData, {


  //  const req = new HttpRequest('POST', `${this.baseUrl}/upload/folder/ ${folder}`, formData, {   originale
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    this.apiUrl = this.baseUrl + this.rotta;
    return this.http.get(`${this.apiUrl}/files`);
   // return this.http.get(`${this.baseUrl}/files`);   originale
  }
}
