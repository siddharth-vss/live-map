const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("location", (data) => {
      io.emit("set-location", { id: socket.id, ...data });
      console.log(data);
  });

  socket.on("disconnect",()=>{
    io.emit("user-disconnect",socket.id);
  })
});

server.listen(3000, () => {
  console.log(`server running on http://localhost:3000`);
});
