const net = require("net");
const port = 3030;
const host = "127.0.0.1"; // сервер прослушивает только локальный сетевой интерфейс
const max = 10;
const min = 0;

const server = net.createServer();
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port);
});

const sockets = [];
server.on("connection", (socket) => {
  console.log("CONNECTED " + socket.remoteAddress + ":" + socket.remotePort);
  sockets.push(socket);
  const x = Math.floor(Math.random() * max) + min;
  console.log("GUESSED " + x);

  socket.on("data", (data) => {
    console.log(
      "DATA " +
        socket.remoteAddress +
        ":" +
        socket.remotePort +
        ' - "' +
        data +
        '"'
    );

    const match = /GUESS\s(\d+)/.exec(data);
    if (match !== null) {
      const input = +match[1];
      if (x == input) {
        socket.write("EQUAL");
      } else if (input < x) {
        socket.write("MORE");
      } else {
        socket.write("LESS");
      }
    }
  });

  socket.on("close", (data) => {
    const index = sockets.findIndex(
      (o) =>
        o.remoteAddress == socket.remoteAddress &&
        o.remotePort == socket.remotePort
    );
    if (index !== -1) {
      sockets.splice(index, 1);
    }
    console.log("CLOSED " + socket.remoteAddress + ":" + socket.remotePort);
  });
});
