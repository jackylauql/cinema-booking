import * as readline from "readline";
import { CinemaRepository } from "./repositories/CinemaRepository";
import { CinemaService } from "./services/CinemaService";
import { BookingRepository } from "./repositories/BookingRepository";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => rl.question(question, resolve));
};

async function main() {
  const cinemaRepo = new CinemaRepository();
  const bookingRepo = new BookingRepository();
  const cinemaService = new CinemaService(cinemaRepo, bookingRepo);
  const input = await ask(
    "Enter cinema setup [Title] [Rows] [SeatsPerRow]:\n > "
  );
  const [title, rowsStr, seatsStr] = input.split(" ");
  const rows = parseInt(rowsStr);
  const seats = parseInt(seatsStr);
  const cinema = cinemaService.createCinema(title, rows, seats);

  while (true) {
    const numOfSeatsAvail = cinemaService.countSeatsAvailByCinemaId(cinema);
    console.log("\nWelcome to GIC Cinemas");
    console.log(
      `[1] Book tickets for ${cinema.title} ${numOfSeatsAvail} seat(s) available\n[2] Check bookings\n[3] Exit`
    );
    const menuInput = await ask("Please enter your selection:\n > ");
    switch (menuInput) {
      case "1":
        await cinemaService.handleBooking(cinema, numOfSeatsAvail);
        break;
      case "2":
        // check booking
        break;
      case "3":
        console.log("Goodbye!");
        rl.close();
        process.exit(0);
      default:
        console.log("Invalid option. Please try again.");
    }
  }
}

main();
