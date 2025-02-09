# Carbon DApp

## Introduction

Carbon DApp is a decentralized application (DApp) designed to mint, trade, and redeem carbon offsets on-chain. By leveraging blockchain technology, it ensures transparency, prevents double spending, and enhances the efficiency of the voluntary carbon market.

More on the technical side is in [GUIDE.md](./GUIDE.md)

## What is a Carbon Offset?

A carbon offset represents a reduction in carbon emissions, often in the form of a certificate detailing the amount of CO2 removed or reduced.

### Example:

**Eco-Farms** plants 10,000 trees, offsetting emissions by 10 tons. The project registers with a carbon registry and receives a certificate. **McDonald’s** purchases the certificate, claiming to offset 10 tons of CO2.

## Issues with the Current System

### Lack of Transparency

Credits are traded over-the-counter with no public data on price and quality, making verification difficult.

### Double Spending

Firms can register with multiple credit registries and receive duplicate certificates, allowing the same credit to be sold multiple times.

### Fragmentation

Carbon credits issued in one jurisdiction are often ineligible for tax breaks or regulatory benefits in another jurisdiction.

## Carbon DApp: The Solution

Carbon DApp addresses these issues by:

- Representing carbon offsets as **ERC-1155** tokens.
- Linking regulatory disclosures and public reports via **Flare** to ensure authenticity.
- Allowing users to mint, trade, and redeem carbon offsets transparently on-chain.

## ERC-1155 Token Structure

- **Public Data**: Includes regulatory, registry data, and project documents.
- **Flare Oracle Contract**: Links real-world data to on-chain assets.
- **ERC-1155 Token Contract**: Facilitates minting, trading, and redemption of tokenized offsets.

## Comparison: Tokenized Offsets vs. Traditional Systems

| Feature                  | Carbon DApp                      | Existing Systems              |
| ------------------------ | -------------------------------- | ----------------------------- |
| **Market Structure**     | Transparent, global market       | Fragmented intermediaries     |
| **Asset Representation** | Singular token per offset        | Potential duplication         |
| **Verification**         | Public, immutable disclosures    | Limited transparency          |
| **Integration**          | Seamless with compliance markets | Poor regulatory compatibility |

## Implementation Strategy

### Capital Markets

Carbon DApp is the **first full-fledged public capital market** for climate initiatives.

### Carbon Registries

Newly registered projects are tokenized and integrated with existing registries like **Verra** and **Gold Standard**.

### UN Agencies

The platform aligns with **UNCTAD, UNFCCC, UNDP**, and other agencies to establish digital standards for on-chain carbon credit trading.
