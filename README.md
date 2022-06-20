# Phoenix-Encryption

## About

Phoenix Encryption was created by me Fenix Hongell as a flexible light-weight encryption. The encryption process is randomized making it un-predictable and hard to break.

## Requirements

- NodeJS

## Installation

- Run `npm -g install https://github.com/FenixHongell/Phoenix-Encryption` in a the terminal or command prompt.

## FAQ

- Q: What is a hash code?
  A: A hash code is a personal code added to the hash of keys. This is useful for making it harder to identify the keys for anyone whom isn't supposed to.
- Q: What does the letters only option do?
  A: If the letters only option is selected only letters will be used in the encryption, depending on the text it may make it more secure.

## Usage

- [] = optional
- if no output file is found one will be created.

### Encrypt

`phenc -f <File name/path> -o <File name/path> -l <true/false> -u <true/false> [-h <your hash code>]`

### Decrypt

`phdec -f <File name/path> -o <File name/path> -m <main key> -k <secondary keys>`

## Important notes

1. Please do _NOT_ separate the keys, instead just type them after each other. Ex. ABCDEFG.
2. Please save your main key and secondary keys, without them you will not be able to recover your data.
3. Please do not show your keys to anyone whom you don't want accessing the data.

_I do not take responsibility for any data lost._ Use with caution.
