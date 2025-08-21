import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import softwaresAcomprar from './src/routes/softwaresAcomprar.router.js'
import ComprarSoftware from "./src/routes/comprar.router.js";
import Login from './src/routes/login.router.js'
import Registrar from './src/routes/register.router.js'
import Webhooks from './src/routes/webhooks.router.js'
import ConsultPayment from './src/routes/consult-payment.router.js'

const app = express();

app.use(express.json());

app.use(cors());

app.use("/softwares", softwaresAcomprar);
app.use("/comprar_software", ComprarSoftware)
app.use("/login", Login)
app.use("/registrar", Registrar)
app.use("/webhooks", Webhooks)
app.use("/payment", ConsultPayment)

app.use(express.urlencoded({ extended: true }));

app.listen(3001, function () {
  console.log("Rodando na porta 3001");
});