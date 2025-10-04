import * as readline from "readline";
import { CinemaRepository } from "./repositories/CinemaRepository";
import { CinemaService } from "./services/CinemaService";
import { BookingRepository } from "./repositories/BookingRepository";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cinemaRepo = new CinemaRepository();
const bookingRepo = new BookingRepository();
const cinemaService = new CinemaService(cinemaRepo, bookingRepo);

let cinemaId: string;

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const input = await ask("Enter cinema setup [Title] [Rows] [SeatsPerRow]: ");
  const [title, rowsStr, seatsStr] = input.split(" ");
  const rows = parseInt(rowsStr, 10);
  const seats = parseInt(seatsStr, 10);
  const cinema = cinemaService.createCinema(title, rows, seats);
  cinemaId = cinema.id;

  while (true) {
    const numOfSeatsAvail = cinemaService.countSeatsAvailByCinemaId(cinemaId);
    console.log("Welcome to GIC Cinemas");
    console.log(
      `[1] Book tickets for ${cinema.title} (${numOfSeatsAvail}) seat(s) available\n[2] Check bookings\n[3] Exit`
    );
    const menuInput = await ask("Choose an option: ");
    switch (menuInput) {
      case "1":
        break;
      case "2":
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
