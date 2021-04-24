import { Resource } from './resource';
import { Structure } from './structure';

export interface Event {
  event_type: string,
  move_count?: number,
  message: string,
  player: number,
  resources: Resource[],
  structures: Structure[],
}