import crypto from "crypto";

export class Cinema {
  public readonly id: string;
  public readonly title: string;
  public readonly rows: number;
  public readonly seatsPerRow: number;
  // public readonly seatMapping: string[][];

  constructor(
    title: string,
    rows: number,
    seatsPerRow: number
    // seatMapping: (string)[][]
  ) {
    if (!title) throw new Error("Title is required");
    if (!rows || rows < 1 || rows > 26) {
      throw new Error("Rows must be between 1 and 26");
    }
    if (!seatsPerRow || seatsPerRow < 1 || seatsPerRow > 50)
      throw new Error("Seats per row must be between 1 and 50");

    this.id = crypto.randomUUID();
    this.title = title;
    this.rows = rows;
    this.seatsPerRow = seatsPerRow;
    // this.seatMapping = Array.from({ length: rows }, () => Array(seatsPerRow).fill(null));
  }
}
