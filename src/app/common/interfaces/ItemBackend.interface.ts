import { BookingData } from './BookingData.interface';
import { NameOfDay } from '../types/NameOfDay.type';

export interface ItemBackend {
  bookingData: BookingData;
  day: NameOfDay;
}
