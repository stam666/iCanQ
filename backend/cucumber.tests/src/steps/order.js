const {
  Given,
  When,
  Then,
  And,
  setWorldConstructor,
} = require("@cucumber/cucumber");
const assert = require("assert").strict;
const axios = require("axios");
const CustomWorld = require("../features/support/world");

const username_customer = "parn_customer";
const username_restaurant = "parn_restaurant";
const password = "12345678";

Given("I logged in as a {string}", async function (role) {
  const username =
    role === "customer" ? username_customer : username_restaurant;
  this.context["authResponse"] = await axios.post(
    "http://localhost:8000/users/auth/login",
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
});

When("I get all restaurants", async function () {
  this.context["response"] = await axios.get(
    "http://localhost:8000/restaurants"
  );
});

Then("I should see all restaurants", async function () {
  assert.notEqual(this.context["response"].data.length, 0);
});

When("I get all menus of restaurant {string}", async function (restaurantId) {
  this.context["response"] = await axios.get(
    `http://localhost:8000/restaurants/getAllRestaurantMenu/${restaurantId}/`
  );
});
Then(
  "I should see menuId : {int} of selected restaurant",
  async function (menuId) {
    assert.equal(this.context["response"].data.data.length, 2);
    assert.equal(this.context["response"].data.data[0].menuId, menuId);
  }
);

When(
  "I place new order with {string} of restaurant {string}",
  async function (menuId, restaurantId) {
    const order = [
      {
        menuId: menuId,
        name: "ก๋วยเตี๋ยว",
        price: 50,
        amount: 1,
        note: "ไม่ใส่หมู",
      },
    ];
    this.context["response"] = await axios.post(
      `http://localhost:8000/order/`,
      {
        restaurantId: restaurantId,
        orderItems: order,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.context["authResponse"].data.token}`,
        },
      }
    );
  }
);

Then("I should see order status {string}", async function (status) {
  assert.equal(this.context["response"].data.status, status);
});

When(
  "I change the status of the incoming order to {string}",
  async function (status) {
    const orderId = this.context["response"].data._id;

    const response = await axios.patch(
      `http://localhost:8000/order/restaurant/status/${orderId}`,
      {
        status: status,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.context["authResponse"].data.token}`,
        },
      }
    );
    console.log("response");
    this.context["response"] = response;
  }
);
