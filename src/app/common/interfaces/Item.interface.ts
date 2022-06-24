import { BookingData } from './BookingData.interface';
import { NameOfDay } from '../types/NameOfDay.type';

export interface Item {
  bookingData: BookingData;
  day: NameOfDay;
  id: string;
}
