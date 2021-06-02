# EverPay

Audit By PeckShield: [PeckShield-Audit-Reprot-everPay-v1.0.pdf](./PeckShield-Audit-Reprot-everPay-v1.0.pdf)

## Development

Develop with [hardhat](https://hardhat.org/tutorial/)

```
npm install
```

### deploy to kovan

Open the hardhat.config.js file in the root directory, configure the PRIVATE_KEY and INFURA_PROJECT_ID

``` js
const PRIVATE_KEY = "";
const INFURA_PROJECT_ID = "";
```

Run

```
npx hardhat run ./scripts/deploy.js --network kovan
```

### test

```
npx hardhat test
```

## Mainnet

#### Contract

[0x38741a69785e84399fcf7c5ad61d572f7ecb1dab](https://etherscan.io/address/0x38741a69785e84399fcf7c5ad61d572f7ecb1dab)

#### Owners

1. 0x5c3066ffc4de627a6b9ea5c3e61e1bf2c369a196
2. 0x6dfe3866098805e6e9fa43d7993a71663324cbae
3. 0xa22789da7b7e918eeafc30e94d2751f3f8179f84

## Kovan

#### Contarct Address

[0xa7ae99C13d82dd32fc6445Ec09e38d197335F38a](https://kovan.etherscan.io/address/0xa7ae99C13d82dd32fc6445Ec09e38d197335F38a)

#### Owners

1. 0xa06b79E655Db7D7C3B3E7B2ccEEb068c3259d0C9

## Features

- [x] Multi-signature
- [x] Owner authority management
- [x] Change requirement
- [x] MetaTransaction
- [x] Support pause with operator
- [x] One proposal supports multiple transactions