import { BookingData } from './BookingData.interface';
import { NameOfDay } from '../types/NameOfDay.type';

export interface DayOfDays {
  day: NameOfDay;
  bookingData?: BookingData[];
}
