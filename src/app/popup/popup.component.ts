import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Data } from '../common/interfaces/Data.interface';
import { UtilityService } from '../common/services/utility.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  popupForm: FormGroup;
  isLoading: boolean;

  constructor(
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private http: HttpClient,
    public translate: TranslateService,
    private utilityService: UtilityService
  ) {
    this.isLoading = false;
  }
  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.popupForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  createPost() {
    if (!this.isFormValid()) {
      return;
    }

    const payload = {
      day: this.data.day,
      bookingData: {
        personBooked: this.popupForm.get('name').value,
        from: this.data.time,
        to: this.utilityService.addOneHour(this.data.time),
      },
    };

    const currentWeek = this.utilityService.getCurrentWeek();
    this.isLoading = true;
    this.http
      .post(
        `https://the-blue-room-91c63-default-rtdb.europe-west1.firebasedatabase.app/${
          'week' + currentWeek
        }/${this.data.day}.json`,
        payload
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          alert('An error has occured!');
        },
      });
  }

  isFormValid(): boolean {
    return this.popupForm.valid;
  }

  close() {
    this.dialogRef.close();
  }
}
