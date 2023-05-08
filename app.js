require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const {
  newUserController,
  getUserController,
  loginController,
} = require("./controllers/users");
const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require("./controllers/links");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// RUTAS DE USUARIOS
app.post("/user", newUserController);
app.get("/user/:id", getUserController);
app.post("/login", loginController);

// RUTAS DE LINKS
app.get("/", getLinksController);
app.post("/", newLinkController);
app.get("/link/:id", getSingleLinkController);
app.delete("/link/:id", deleteLinkController);

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

app.use((error, req, res) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log(`Server listening http://localhost:3000 👻`);
});
