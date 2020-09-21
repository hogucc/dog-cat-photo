#!/usr/bin/env node

const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const inquirer = require("inquirer");
const dogPhotoFileName = "dog.png";
const catPhotoFileName = "cat.png";

async function getDogPhoto(page) {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  await page.goto(data.message);
  await page.screenshot({ path: dogPhotoFileName });
}

async function getCatPhoto(page) {
  const response = await fetch("https://aws.random.cat/meow");
  const data = await response.json();
  await page.goto(data.file);
  await page.screenshot({ path: catPhotoFileName });
}

async function displaySavedPhotoMessage(photo_type) {
  console.log(`saved the picture to ${process.cwd()}/${photo_type}`);
}

async function takeScreenshot(choice) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (choice === "🐶") {
    await getDogPhoto(page);
    console.log("got a picture of 🐶");
    await displaySavedPhotoMessage(dogPhotoFileName);
  } else if (choice === "🐱") {
    await getCatPhoto(page);
    console.log("got a picture of 🐱");
    await displaySavedPhotoMessage(catPhotoFileName);
  } else {
    await getDogPhoto(page);
    await getCatPhoto(page);
    console.log(`got a picture of 🐶 🐱`);
    await displaySavedPhotoMessage(dogPhotoFileName);
    await displaySavedPhotoMessage(catPhotoFileName);
  }

  await browser.close();
}

function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "memo",
        message: "Are you a dog or cat person?:",
        choices: ["🐶", "🐱", "🐶  and 🐱  aren't looking for a fight."]
      }
    ])
    .then(answers => {
      takeScreenshot(answers["memo"]);
    })
    .catch(error => {
      console.error(error);
    });
}

main();
