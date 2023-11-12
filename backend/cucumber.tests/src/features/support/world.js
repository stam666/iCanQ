// features/support/world.js
const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
  constructor({ parameters }) {
    // Initialize your context properties here
    this.context = {};
    this.response = 500;
  }

  setResponse(response) {
    this.response = response;
  }
}

setWorldConstructor(CustomWorld);
module.exports = { CustomWorld };
