export interface SeatPosition {
  rowIndex: number;
  colIndex: number;
}

export interface Booking {
  id: string;
  cinemaId: string;
  seats: SeatPosition[];
}
