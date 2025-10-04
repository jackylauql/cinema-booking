import { BookingRepository } from "../repositories/BookingRepository";
import { Cinema } from "../models/Cinema";
import { CinemaRepository } from "../repositories/CinemaRepository";

export class CinemaService {
  constructor(
    private cinemaRepo: CinemaRepository,
    private bookingRepo: BookingRepository
  ) {}

  createCinema(title: string, rows: number, seatsPerRow: number): Cinema {
    const cinema = new Cinema(title, rows, seatsPerRow);
    return this.cinemaRepo.save(cinema);
  }

  countSeatsAvailByCinemaId(cinemaId: string): number {
    const cinema = this.cinemaRepo.findById(cinemaId);
    if (!cinema) throw new Error("Cinema not found");

    const bookedSeats = this.bookingRepo.countAll({
      key: "cinemaId",
      value: cinemaId,
    });
    return cinema.rows * cinema.seatsPerRow - bookedSeats;
  }
}
