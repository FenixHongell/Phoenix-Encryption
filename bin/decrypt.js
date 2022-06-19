#!/usr/bin/env node

import yargs from "yargs";
import fs from "fs";

function readEncryption(_keys, _mainKey, _content, debug) {
  let content = createMainString(_keys, _mainKey, _content);
  if (debug) {
    console.log("\x1b[46m%s\x1b[0m", "\n\nStarting to decrypt encryption\n");
  }
  let mainString = []; //The main text
  let keys = []; //all of the keys to the encryption
  let keysRemove = []; //The letters that will be removed from the text
  let safeKeys = [];
  for (let currentLetter = 0; currentLetter < content.length; currentLetter++) {
    //Loops trough all the letters in the encrypted text
    const element = content[currentLetter];
    if (currentLetter <= 9) {
      //Checks if loop is going trough the keys
      keys.push(element);
      if (currentLetter != 0) {
        //If the current element isn't the main key, push it to the array with the "remove" keys
        keysRemove.push(element);
      }
    } else {
      //If not a key push to main array
      mainString.push(element);
    }
  }
  // #region Debug check
  if (debug) {
    console.log("\x1b[36m%s\x1b[0m", "\nReading keys: " + keys);
    console.log("\x1b[35m%s\x1b[0m", "\nReading mainString: " + mainString);
    console.log(
      "\x1b[32m%s\x1b[0m",
      "\nReading encrypted mainString: " + mainString.join("")
    );
  }
  //#endregion

  for (let index = 0; index < mainString.length; index++) {
    //Goes trough all letters, removes keys that are supposed to be removed
    const element = mainString[index];
    if (keysRemove.includes(element) && index > 0) {
      if (mainString[index - 1] != keys[0]) {
        mainString[index] = "";
      } else {
        mainString[index - 1] = "";
      }
    }
  }
  //Removes first character if needed
  if (keysRemove.includes(mainString[0])) {
    mainString[0] = "";
  }
  //Output
  if (debug) {
    console.log("\x1b[35m%s\x1b[0m", "\nUnEncrypted mainString: " + mainString);
    console.log(
      "\x1b[32m%s\x1b[0m",
      "\nFinal mainString: " + mainString.join("")
    );
  }
  return mainString.join("");
}

function createMainString(keys, mainKey, mainString) {
  return mainKey + keys + mainString;
}

const options = yargs
  .usage(
    "Usage: -f <path to file> -o <output file path/name> -m <Main Key here> -k <keys here, DO NOT SEPARATE>"
  )
  .option("f", {
    alias: "file",
    describe: "path to file",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output",
    describe: "output file name",
    type: "string",
    demandOption: true,
  })
  .option("m", {
    alias: "mainKey",
    describe: "mainKey",
    type: "string",
    demandOption: true,
  })
  .option("k", {
    alias: "keys",
    describe: "keys",
    type: "string",
    demandOption: true,
  })
  .option("debug", {
    alias: "debug-code",
    describe: "Debug option",
    type: "boolean",
    demandOption: false,
  }).argv;

try {
  fs.writeFileSync(
    options.output,
    readEncryption(
      options.keys,
      options.mainKey,
      fs.readFileSync(options.file).toString(),
      options.debug
    )
  );
} catch (error) {
  console.log(
    "Phoenix Encryption ran in to an error, this was most likely caused by an invalid file path."
  );
  console.log(error);
}
