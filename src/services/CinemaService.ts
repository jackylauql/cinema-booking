import { BookingRepository } from "../repositories/BookingRepository";
import { Cinema } from "../models/Cinema";
import { CinemaRepository } from "../repositories/CinemaRepository";
import { Booking, SeatPosition } from "../models/Booking";
import { ask } from "../cli";
import {
  getRowIndexBasedOnChar,
  getUpperCaseChar,
} from "../utils/sanitizeAndparseInitInput";

export class CinemaService {
  constructor(
    private cinemaRepo: CinemaRepository,
    private bookingRepo: BookingRepository
  ) {}

  async handleBooking(cinema: Cinema, numOfSeatsAvail: number): Promise<void> {
    while (true) {
      const ticketInput = await ask(
        "\nEnter number of tickets to book, or enter blank to go back to main menu:\n > "
      );

      if (!ticketInput) break;
      const numOfTickets = parseInt(ticketInput);
      if (isNaN(numOfTickets) || numOfTickets < 1) {
        console.log("\nPlease enter a valid number greater than 0.");
        continue;
      }
      if (numOfTickets > numOfSeatsAvail) {
        console.log(
          `\nSorry, there are only ${numOfSeatsAvail} seat(s) available.`
        );
        continue;
      }

      const booking = this.reserveTickets(cinema, numOfTickets);
      console.log(this.renderCinema(cinema, booking.seats));
      const confirmInput = await ask(
        "\nEnter blank to accept seat selection, or enter new seating position: "
      );
      if (confirmInput) {
        const rowChar = confirmInput.charAt(0).toUpperCase();
        const rowIndex = getRowIndexBasedOnChar(rowChar);
        if (rowIndex < 0 || rowIndex >= cinema.rows) {
          console.log("\nInvalid row. Please try again.");
          continue;
        }
        const colStr = confirmInput.slice(1);
        const colIndex = parseInt(colStr) - 1;
        if (isNaN(colIndex) || colIndex < 0 || colIndex >= cinema.seatsPerRow) {
          console.log("\nInvalid seat number. Please try again.");
          continue;
        }
        const updatedBooking = this.updateBooking(
          booking.id,
          { rowIndex, colIndex },
          numOfTickets,
          cinema.id
        );
        console.log(this.renderCinema(cinema, updatedBooking.seats));
      } else {
        console.log(`\nBooking id: ${booking.id} confirmed.`);
        break;
      }
    }
  }

  createCinema(title: string, rows: number, seatsPerRow: number): Cinema {
    const cinema = new Cinema(title, rows, seatsPerRow);
    return this.cinemaRepo.save(cinema);
  }

  countSeatsAvailByCinemaId(cinema: Cinema): number {
    if (!cinema) throw new Error("Cinema not found");

    const bookings = this.bookingRepo.findAll([
      {
        key: "cinemaId",
        value: cinema.id,
      },
    ]);
    let bookedSeats = 0;
    for (let i = 0; i < bookings.length; i++) {
      bookedSeats += bookings[i].seats.length;
    }
    return cinema.rows * cinema.seatsPerRow - bookedSeats;
  }

  private allocateDefaultSeats(
    cinema: Cinema,
    seatsNeeded: number,
    bookedSeatsHash: Set<string>,
    startingRowIndex?: number
  ): SeatPosition[] {
    const positions: SeatPosition[] = [];
    let row = startingRowIndex || cinema.rows - 1;
    for (row; row >= 0 && positions.length < seatsNeeded; row--) {
      const middleCol = Math.floor((cinema.seatsPerRow - 1) / 2);
      let left = middleCol;
      let right = middleCol;
      if (cinema.seatsPerRow % 2 === 0) right += 1;
      while (left >= 0 && positions.length < seatsNeeded) {
        if (!bookedSeatsHash.has(`${row}-${left}`)) {
          bookedSeatsHash.add(`${row}-${left}`);
          positions.push({ rowIndex: row, colIndex: left });
        }
        if (
          positions.length < seatsNeeded &&
          !bookedSeatsHash.has(`${row}-${right}`)
        ) {
          bookedSeatsHash.add(`${row}-${right}`);
          positions.push({ rowIndex: row, colIndex: right });
        }
        left--;
        right++;
      }
    }
    return positions;
  }

  private allocateSeatsBySpecifiedPosition(
    cinema: Cinema,
    startingPosition: SeatPosition,
    seatsNeeded: number,
    bookedSeatsHash: Set<string>
  ): SeatPosition[] {
    const positions: SeatPosition[] = [];

    for (
      let col = startingPosition.colIndex;
      col < cinema.seatsPerRow && positions.length < seatsNeeded;
      col++
    ) {
      if (!bookedSeatsHash.has(`${startingPosition.rowIndex}-${col}`)) {
        bookedSeatsHash.add(`${startingPosition.rowIndex}-${col}`);
        positions.push({ rowIndex: startingPosition.rowIndex, colIndex: col });
      }
    }
    if (positions.length < seatsNeeded) {
      const additionalSeats = this.allocateDefaultSeats(
        cinema,
        seatsNeeded - positions.length,
        bookedSeatsHash,
        startingPosition.rowIndex - 1
      );
      positions.push(...additionalSeats);
    }
    return positions;
  }

  reserveTickets(cinema: Cinema, seatsNeeded: number): Booking {
    if (!cinema) throw new Error("Cinema not found");
    const bookedSeats = this.bookingRepo.findAll([
      {
        key: "cinemaId",
        value: cinema.id,
      },
    ]);
    const bookedSeatsHash = new Set<string>();

    bookedSeats.forEach((booking) => {
      booking.seats.forEach((seat) => {
        bookedSeatsHash.add(`${seat.rowIndex}-${seat.colIndex}`);
      });
    });
    const allocatedSeats = this.allocateDefaultSeats(
      cinema,
      seatsNeeded,
      bookedSeatsHash
    );

    const booking = new Booking(cinema.id, allocatedSeats);
    return this.bookingRepo.save(booking);
  }

  updateBooking(
    bookingId: string,
    startingPosition: SeatPosition,
    numOfTickets: number,
    cinemaId: string
  ): Booking {
    const bookedSeats = this.bookingRepo.findAll([
      {
        key: "cinemaId",
        value: cinemaId,
      },
      {
        key: "id",
        value: bookingId,
        operator: "!=",
      },
    ]);
    const bookedSeatsHash = new Set<string>();
    bookedSeats.forEach((booking) => {
      booking.seats.forEach((seat) => {
        bookedSeatsHash.add(`${seat.rowIndex}-${seat.colIndex}`);
      });
    });
    const allocatedSeats = this.allocateSeatsBySpecifiedPosition(
      this.cinemaRepo.findById(cinemaId)!,
      startingPosition,
      numOfTickets,
      bookedSeatsHash
    );
    return this.bookingRepo.update(bookingId, { seats: allocatedSeats })!;
  }

  getBookingById(bookingId: string): Booking | undefined {
    return this.bookingRepo.findById(bookingId);
  }

  renderCinema(cinema: Cinema, highlightPositions?: SeatPosition[]) {
    if (!cinema) return "Cinema not found";

    const lines: string[] = [];

    const bookedSeats = this.bookingRepo.findAll([
      {
        key: "cinemaId",
        value: cinema.id,
      },
    ]);
    const bookedSeatsHash = new Set<string>();
    bookedSeats.forEach((booking) => {
      booking.seats.forEach((seat) => {
        bookedSeatsHash.add(`${seat.rowIndex}-${seat.colIndex}`);
      });
    });

    for (let row = 0; row < cinema.rows; row++) {
      const label = getUpperCaseChar(row);

      const rowSeats = Array.from(Array(cinema.seatsPerRow).keys()).map(
        (col) => {
          if (
            highlightPositions?.find(
              (seat) => seat.colIndex === col && seat.rowIndex === row
            )
          )
            return "o";
          if (bookedSeatsHash.has(`${row}-${col}`)) return "#";
          return ".";
        }
      );

      lines.push(label + " " + rowSeats.join("  "));
    }
    const seatNums = Array.from(Array(cinema.seatsPerRow).keys()).map(
      (i) => i + 1
    );
    lines.push("  " + seatNums.join("  "));
    return lines.join("\n");
  }
}
