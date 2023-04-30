const net = require("net");
const port = 3030;
const host = "127.0.0.1";

const socket = new net.Socket();

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const guess = () => {
  readline.question("Guess: ", (x) => {
    socket.write(`GUESS ${x}`);
  });
};

socket.connect(port, host, () => {
  console.log("Connected");
  guess();
});

socket.on("data", (data) => {
  console.log('Server says: "' + data + '"');
  if (data == "EQUAL") {
    socket.destroy();
  } else {
    guess();
  }
});

socket.on("close", () => {
  console.log("Connection closed");
  readline.close();
});
