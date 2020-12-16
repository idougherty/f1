let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height)

c.fillStyle = "white";
c.fillText("test", 100, 200);