
export interface Employee {
  id: string;
  name: string;
  returnTime: string;
  destination: string;
}

export interface CalendarConfig {
  id: string;
  name: string;
  src: string; // The embeddable URL for the iframe
}
