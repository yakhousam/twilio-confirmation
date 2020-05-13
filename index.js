require('dotenv').config()
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("get index");
  res.send("welocme to the home page");
});

app.post("/confirm", (req, res) => {
  const body = req.body;
  console.log("reservation confirmed =", body);
  res.send("reservation confirmed");
});

app.post("/cancel", (req, res) => {
  const body = req.body;
  console.log("reservation canceled =", body);
  res.send("reservation canceled");
});

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.post("/reminder", (req, res) => {
  const { time, userId } = req.body;
  // https://studio.twilio.com/v1/Flows/FW312f37791c3bea9110c63fa4dd0bcc18/Executions
  client.studio.v1
    .flows("FW312f37791c3bea9110c63fa4dd0bcc18")
    .executions.create({
      to: process.env.TO,
      from: process.env.FROM,
      parameters: {
        appointment_time: time,
        user_id: userId,
      },
    })
    .then((execution) => {
      console.log(execution.status);
      res.send(execution);
    });
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000/");
});
