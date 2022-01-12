const express = require("express");
const app = express();
const multer = require("multer");

const template = require("lodash.template");
const fs = require("fs");

app.use(require("cors")({ origin: "*" }));

app.get("/", (_, res) => res.status(200).send("Mail test"));

const DB = {};

// @todo Secure this endpoint, only allow sendgrid to hit this
app.post("/", multer().any(), async (req, res) => {
  const { to, from, subject, html, text, envelope } = req.body;

  console.log(req.body);

  // Use firebase add instead of generating like this to ensure no collisions
  const key = Math.random().toString(36).slice(2, 8);
  DB[key] = { to, from, subject, html };

  // Reply this to the email!
  console.log(`http://localhost:3000/site/${key}`);

  res.status(200).end();
});

app.get("/site/:key", (req, res) => {
  const item = DB[req.params.key];

  if (!item) return res.status(404).end();

  const compiler = template(
    fs.readFileSync(__dirname + "/template.html", "utf8")
  );

  res.status(200).send(
    compiler({
      title: item.subject,
      content: item.html,
      from: item.from,
    })
  );
});

app.get("/example", (req, res) => {
  const compiler = template(
    fs.readFileSync(__dirname + "/template.html", "utf8")
  );
  res.status(200).send(
    compiler({
      title: "test title!!",
      content: "some content",
      from: "jaimeloeuf@gmail.com",
    })
  );
});

const port = process.env.PORT || 3000; // Defaults to PORT 3000
app.listen(port, () => console.log(`Server running on port: ${port}`));
