import { Server } from "http";
import app from "./app";

const port = 4000;

let server: Server;

async function main() {
  server = app.listen(port, () => {
    console.log("Server listening on port " + port);
  });
}

main();

process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("uncaughtException", () => {
  process.exit(1);
});
