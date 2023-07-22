
import { Component, OnInit } from '@angular/core';
import { TestUploadService } from './../../services/test-upload.service';


@Component({
  selector: 'app-testupload',
  templateUrl: './testupload.component.html',
  styleUrls: ['./testupload.component.css']
})
export class TestuploadComponent implements OnInit {

  file: File = null;

  constructor(
    private testUploadService: TestUploadService
  ) { }

  ngOnInit(): void {
  }


  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }

  upload() {
    if (this.file) {
      this.testUploadService.uploadfile(this.file).subscribe(resp => {
        alert("Uploaded")
      })
    } else {
      alert("Please select a file first")
    }
  }


}
