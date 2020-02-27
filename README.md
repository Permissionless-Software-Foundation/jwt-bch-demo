# jwt-bch-demo
A minimal node.js JavaScript app that demonstrates how to create an application
with automated JWT token management.

This demo queries the BCH balance of a single address every 10 seconds. It uses
the free-tier of [Fullstack.cash](https://fullstack.cash) to access the Bitcoin
Cash blockchain. It uses
the [jwt-bch-lib](https://github.com/Permissionless-Software-Foundation/jwt-bch-lib) npm
library to automatically renew its JWT token if it expires. This automated renewal
is the focus of the demo.

## Install
- Clone this repository: `git clone https://github.com/Permissionless-Software-Foundation/jwt-bch-demo`
- Enter the new directory: `cd jwt-bch-demo`
- Install dependencies: `npm install`
- Start the demo: `npm start`

## License
[MIT](./LICENSE.md)
