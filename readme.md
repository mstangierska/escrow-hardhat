
https://github.com/user-attachments/assets/64916662-c4ab-40de-bfdf-40c7dc70af0b
# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Changes to Alchemy University project

The main changes applied to the [project](https://university.alchemy.com/course/ethereum/md/63f8fc3b7163970002576467) are:
1) Persistent contracts in Existing Contracts tab
2) Front-end adjustments
3) Wei to Ether conversions


## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.



