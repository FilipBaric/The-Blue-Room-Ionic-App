import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { AltPopupComponent } from './alt-popup/alt-popup.component';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { TranslateService } from '@ngx-translate/core';
import { DayItem } from './common/interfaces/DayItem.interface';
import { DayOfDays } from './common/interfaces/DayOfDays.interface';
import { TIMES } from './common/constants/times.constant';
import { Days } from './common/enums/days.enum';
import { UtilityService } from './common/services/utility.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular';
  hasData: boolean = false;
  days: DayOfDays[] = [];

  toggleControl = new FormControl(false);
  @HostBinding('class') className = '';

  times = TIMES;

  currDate = new Date();
  first = this.currDate.getDate() - this.currDate.getDay() + 1;
  last = this.first + 4;
  sunday = this.first + 6;

  today = new Date().toLocaleDateString();
  firstDay = new Date(this.currDate.setDate(this.first)).toLocaleDateString();
  lastDay = new Date(this.currDate.setDate(this.last)).toLocaleDateString();
  sundayDate = new Date(
    this.currDate.setDate(this.sunday)
  ).toLocaleDateString();

  constructor(
    private dialog: MatDialog,
    private db: AngularFireDatabase,
    public translate: TranslateService,
    private utilityService: UtilityService
  ) {
    this.setDays();

    translate.addLangs(['English', 'Hrvatski', 'Deutsch']);
    translate.setDefaultLang('English');

    const browserLang = translate.getBrowserLang();
    translate.use(
      browserLang.match(/English|Hrvatski|Deutsch/) ? browserLang : 'English'
    );
  }
  ngOnInit() {
    this.onValueChange();
  }

  setLanguage(language: string) {
    this.translate.use(language);
  }

  onValueChange() {
    const currentWeek = this.utilityService.getCurrentWeek();

    this.db
      .list('week' + currentWeek)
      .valueChanges()
      .subscribe((res: DayItem[]) => {
        this.manipulateFrontendData(res);
      });
  }

  setDays() {
    this.days = [
      {
        day: Days.MONDAY,
        bookingData: [],
      },
      {
        day: Days.TUESDAY,
        bookingData: [],
      },
      {
        day: Days.WEDNESDAY,
        bookingData: [],
      },
      {
        day: Days.THURSDAY,
        bookingData: [],
      },
      {
        day: Days.FRIDAY,
        bookingData: [],
      },
    ];
  }

  openBookModal(day: DayOfDays, time: string): void {
    const data = day.bookingData.find((bookedTime) => bookedTime.from === time);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (data === undefined) {
      this.dialog.open(PopupComponent, {
        data: {
          day: day.day,
          time: time,
        },
        panelClass: 'my-dialog',
      });
    } else {
      this.dialog.open(AltPopupComponent, {
        data: {
          id: data.id,
          day: day.day,
          time: time,
        },
        width: '250px',
        panelClass: 'my-dialog',
      });
    }
  }

  getPersonBooked(tableDay: DayOfDays, time: string) {
    const dataDay = this.days.find((day) => day.day === tableDay.day);
    const data = dataDay.bookingData.find(
      (bookedTime) => bookedTime.from === time
    );
    return data?.personBooked;
  }

  manipulateFrontendData(frontendData: DayItem[]) {
    this.setDays();
    frontendData.forEach((item) => {
      const entries = Object.entries(item);

      entries.forEach((entry) => {
        const id = entry[0];
        const item = entry[1];

        this.days.forEach((day) => {
          console.log(day);

          if (day.day === item.day) {
            item.bookingData.id = id;
            day.bookingData.push(item.bookingData);
          }
        });
      });
    });
  }
}
