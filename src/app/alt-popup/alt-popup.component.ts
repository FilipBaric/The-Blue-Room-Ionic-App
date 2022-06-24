import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '../common/interfaces/Data.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DAYS } from '../common/constants/days.constant';
import { TIMES } from '../common/constants/times.constant';
import { UtilityService } from '../common/services/utility.service';

@Component({
  selector: 'app-alt-popup',
  templateUrl: './alt-popup.component.html',
  styleUrls: ['./alt-popup.component.css'],
})
export class AltPopupComponent implements OnInit {
  value: string;

  times = TIMES;
  days = DAYS;

  isLoading1: boolean;
  isLoading2: boolean;
  altPopupForm: FormGroup;
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AltPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public translate: TranslateService,
    private utilityService: UtilityService
  ) {
    this.isLoading1 = false;
    this.isLoading2 = false;
  }

  initForm() {
    this.altPopupForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      time: new FormControl(null, Validators.required),
      day: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  updateRequest() {
    const payload = {
      day: this.data.day,
      bookingData: {
        personBooked: this.altPopupForm.get('name').value,
        from: this.altPopupForm.get('time').value,
        to: this.utilityService.addOneHour(this.altPopupForm.get('time').value),
      },
    };

    const currentWeek = this.utilityService.getCurrentWeek();

    this.isLoading1 = true;
    console.log(currentWeek);

    this.http
      .patch(
        `https://the-blue-room-91c63-default-rtdb.europe-west1.firebasedatabase.app/${
          'week' + currentWeek
        }/${this.data.day}/${this.data.id}.json`,
        payload
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  deleteRequest() {
    const currentWeek = this.utilityService.getCurrentWeek();
    this.isLoading2 = true;
    this.http
      .delete(
        `https://the-blue-room-91c63-default-rtdb.europe-west1.firebasedatabase.app/${
          'week' + currentWeek
        }/${this.data.day}/${this.data.id}.json`
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  close() {
    this.dialogRef.close();
  }
}
