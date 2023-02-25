import app from "./app.js";
// Server is listening
app.listen(app.get("port"));

console.log("Server on port", app.get("port"));
console.log("Environment:", process.env.NODE_ENV);