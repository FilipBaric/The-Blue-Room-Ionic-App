import { ItemBackend } from './ItemBackend.interface';

export interface backendRespons {
  Monday: { [key: string]: ItemBackend };
  Thursday: { [key: string]: ItemBackend };
  Wednesday: { [key: string]: ItemBackend };
  id: boolean;
}
