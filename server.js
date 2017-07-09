let express = require("express");

let app = express();

let path = require("path");

let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'static')));

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

require("./server/config/routes.js")(app);

let server = app.listen(3316, () => {
	console.log("App listening on port 3316");
});

let io = require("socket.io").listen(server);

io.sockets.on("connection", (socket) => {
	var count = 0;
	console.log("Socket, online!");
	console.log(socket.id);
	socket.emit("begin", {count: count});

	socket.on("increase_count", () => {
		console.log("The count will increase by 1!");
		count++;
		console.log(count)
		socket.emit("count_increased", {count: count})
	});
	socket.on("reset_count", (data) => {
		console.log("The count will be reset!")
		count = data.count;
		count = 0;
		console.log(count);
		socket.emit("count_reset", {count: count})
	})
});
