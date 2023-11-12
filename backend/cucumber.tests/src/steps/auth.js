const {
  Given,
  When,
  Then,
  setWorldConstructor,
} = require("@cucumber/cucumber");
const assert = require("assert").strict;
const axios = require("axios");
const CustomWorld = require("../features/support/world");

Given("I am a customer", function () {
  // Write code here that turns the phrase above into concrete actions
  console.log("pass");
});

When(
  "I sign in with {string} and {string}",
  async function (username, password) {
    this.context["response"] = await axios.post(
      "http://localhost:8001/auth/login",
      {
        input: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
);

Then("I get response code {int}", async function (responseCode) {
  assert.equal(this.context["response"].status, responseCode);
});
