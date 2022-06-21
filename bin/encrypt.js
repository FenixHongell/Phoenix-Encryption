#!/usr/bin/env node

import yargs from "yargs";
import fs from "fs";
import sha256 from "js-sha256";
function writeEncryption(content, useHash, hashCode, debug, lettersOnly) {
  //All characters in encryption
  let charList;
  if (lettersOnly) {
    charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else {
    charList =
      "!#$%'()+,-.0123456789:;<=>@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{}~";
  }
  let keys = []; //Keys of encryption
  let mainString = []; //Main string
  //#region Basic Generation
  for (let currentLetter = 0; currentLetter < content.length; currentLetter++) {
    //Turning input string to array for easier manipulation
    const element = content[currentLetter];
    mainString.push(element);
  }
  for (let j = 0; j < 10; j++) {
    //Generating keys
    keys.push(charList[Math.floor(Math.random() * charList.length)]);
  }

  for (let keyCheck = 0; keyCheck < keys.length - 1; keyCheck++) {
    //Checking for overlapping keys
    const element = keys[keyCheck];
    if (element == keys[9]) {
      keys[keyCheck] = "";
    }
  }
  //Checking for main key in base string
  if (mainString.includes(keys[9])) {
    let oldKey = keys[9];
    keys[9] = "CHANGING"; //Placeholder value for easier checks
    //Tries to see if it can switch with any of the other keys
    for (
      let keyChangeIndex = 0;
      keyChangeIndex < keys.length - 1;
      keyChangeIndex++
    ) {
      const element = keys[keyChangeIndex];
      if (!mainString.includes(element)) {
        //If the element isn't in the base string the keys will swap
        keys[9] = element;
        keys[keyChangeIndex] = oldKey;
        break;
      }
    }
    //If no valid keys were found, it will see if an unused character is available
    if (keys[9] == "CHANGING") {
      for (
        let charListIndex = 0;
        charListIndex < charList.length;
        charListIndex++
      ) {
        //If the element isn't in the base string the keys value will be changed
        const element = charList[charListIndex];
        if (!mainString.includes(element)) {
          keys[9] = element;
          break;
        }
      }
    }
  }
  //#endregion
  //#region Debug outputs
  if (debug) {
    console.log("\x1b[36m%s\x1b[0m", "\nKeys: " + keys);
    console.log("\x1b[36m%s\x1b[0m", "\nMain key: " + keys[9]);
    console.log(
      "\x1b[32m%s\x1b[0m",
      "\nMain string input: " + mainString.join("")
    );
  }
  //#endregion
  //Encrypts string
  for (let index = 0; index < mainString.length; index++) {
    const element = mainString[index];
    if (keys.includes(element)) {
      //If the current letter is in the array of keys, the main key will be added
      let changeString = keys[9] + element;
      mainString[index] = changeString;
    } else {
      //Random keys will be inserted into the string for encryption
      let times = Math.floor(Math.random() * 25) + 3;
      for (
        let insertedKeysIndex = 0;
        insertedKeysIndex < times;
        insertedKeysIndex++
      ) {
        let changeChar = keys[Math.floor(Math.random() * 8)];
        let changeString = changeChar + element;
        mainString[index] = changeString;
      }
    }
  }
  //Output
  if (debug) {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "\nMain string final: " + mainString.join("")
    );
  }
  if (useHash) {
    console.log("Main key (SAVE THIS): " + sha256(hashCode + keys[9]));
    keys.pop();
    console.log("Secondary keys (SAVE THESE): ");
    let keyI = 1;
    keys.forEach((_key_) => {
      console.log("Key number " + keyI + ". " + sha256(hashCode + _key_));
      keyI += 1;
    });
  } else {
    console.log("Main key (SAVE THIS): " + keys[9]);
    keys.pop();
    console.log("Secondary keys (SAVE THESE): ");
    let keyI = 1;
    keys.forEach((_key_) => {
      console.log("Key number " + keyI + ". " + _key_);
      keyI += 1;
    });
  }
  //Returns encrypted string
  return mainString.join("").toString();
}

const options = yargs
  .usage(
    "Usage: -f <path to file> -o <output file path/name> -u <true/false> [-h <private code here>]"
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
  .option("u", {
    alias: "useHash",
    describe: "use hash on keys",
    type: "boolean",
    demandOption: true,
  })
  .option("l", {
    alias: "letters-only",
    describe: "Letters only?",
    type: "boolean",
    demandOption: true,
  })
  .option("h", {
    alias: "hashCode",
    describe: "code added to hash for added security",
    type: "string",
    demandOption: false,
  })
  .option("debug", {
    alias: "debug-code",
    describe: "Debug option",
    type: "boolean",
    demandOption: false,
  }).argv;

try {
  let hc = options.hashCode;
  if (hc == undefined) {
    hc = "";
  } else if (hc == null) {
    hc = "";
  }
  fs.writeFileSync(
    options.output,
    writeEncryption(
      fs.readFileSync(options.file).toString(),
      options.useHash,
      hc,
      options.debug,
      options.l
    )
  );
} catch (error) {
  console.log(
    "Phoenix Encryption ran in to an error, this was most likely caused by an invalid file path."
  );
  console.log(error);
}

console.log(
  "DISCLAIMER: Due to the nature of the algorithm, the encryption may be less secure at times. If you are not satisfied with the result just run the command again."
);
