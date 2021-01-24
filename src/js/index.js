"use strict";
import "@babel/polyfill";
import "../index.html";
import "../scss/style.scss";

const burger = document.querySelector(".header-bar__burger");
const menu = document.querySelector(".header-bar__menu");
burger.addEventListener("click", (event) => {
  event.preventDefault();
  if (!menu.classList.contains("show")) {
    burger.classList.add("active");
    menu.classList.add("show");
  } else {
    burger.classList.remove("active");
    menu.classList.remove("show");
  }
});
document.body.addEventListener("click", (e) => {
  e.preventDefault();
  if (!menu.contains(e.target) && !burger.contains(e.target)) {
    burger.classList.remove("active");
    menu.classList.remove("show");
  }
});
