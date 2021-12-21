export interface IEvent {
  id: string | number;
  title: string;
  date: string;
  time: string;
  speaker: string;
  venue: string;
  flyer?: string;
  extraDetails?: {};
  description: string;
  photos?: string[];
}
