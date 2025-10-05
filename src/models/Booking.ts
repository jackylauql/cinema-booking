import crypto from "crypto";

export interface SeatPosition {
  rowIndex: number;
  colIndex: number;
}

export class Booking {
  public readonly id: string;
  public readonly cinemaId: string;
  public readonly seats: SeatPosition[];

  constructor(cinemaId: string, seats: SeatPosition[]) {
    if (!cinemaId) throw new Error("Cinema Id is required");
    if (!seats || seats.length < 1)
      throw new Error("There must be at least 1 seat for booking");

    this.id = crypto.randomUUID();
    this.cinemaId = cinemaId;
    this.seats = seats;
  }
}
