const express = require("express");
const app = express();
const multer = require("multer");

const template = require("lodash.template");
const fs = require("fs");

const DS = require("./datastore");

app.use(require("cors")({ origin: "*" }));
app.get("/", (_, res) => res.status(200).send("Mail to Site service"));

app.post(
  "/",

  // @todo Add middleware to secure this endpoint, only allow sendgrid to hit this

  multer().any(),

  async (req, res) => {
    const { to, from, subject, html, text, envelope } = req.body;

    // If the email is forwarded to an invalid address, ignore it but let sendgrid know that it is received with HTTP 200
    // @todo Might email user to let them know that it was unsuccessful
    if (to !== "post@m2s.enkeldigital.com") return res.status(200).end();

    // @todo Reply link to the email!
    const link = await DS.add({ to, from, subject, html });
    console.log(link);

    res.status(200).end();
  }
);

app.get("/site/:key", async (req, res) => {
  const item = await DS.get(req.params.key);

  // Send a 404 page instead of just this
  if (!item) return res.status(404).end();

  // @todo Refactor this out
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

const port = process.env.PORT || 3000; // Defaults to PORT 3000
app.listen(port, () => console.log(`Server running on port: ${port}`));
