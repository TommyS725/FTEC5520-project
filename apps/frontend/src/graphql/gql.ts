/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query listedInsuranceTokens {\n    insuranceTokens(where: { listedPrice_not: null }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n": typeof types.ListedInsuranceTokensDocument,
    "\n  query ownedInsuranceTokens($address: String!) {\n    insuranceTokens(where: { owner: $address }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n": typeof types.OwnedInsuranceTokensDocument,
    "\n  query Policy {\n    policies {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n": typeof types.PolicyDocument,
    "\n  query OpenPolicy($currentTimestamp: String!) {\n    policies(\n      where: { expiration_gt: $currentTimestamp, open: true, inventory_gt: \"0\" }\n    ) {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n": typeof types.OpenPolicyDocument,
};
const documents: Documents = {
    "\n  query listedInsuranceTokens {\n    insuranceTokens(where: { listedPrice_not: null }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n": types.ListedInsuranceTokensDocument,
    "\n  query ownedInsuranceTokens($address: String!) {\n    insuranceTokens(where: { owner: $address }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n": types.OwnedInsuranceTokensDocument,
    "\n  query Policy {\n    policies {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n": types.PolicyDocument,
    "\n  query OpenPolicy($currentTimestamp: String!) {\n    policies(\n      where: { expiration_gt: $currentTimestamp, open: true, inventory_gt: \"0\" }\n    ) {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n": types.OpenPolicyDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query listedInsuranceTokens {\n    insuranceTokens(where: { listedPrice_not: null }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n"): typeof import('./graphql').ListedInsuranceTokensDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ownedInsuranceTokens($address: String!) {\n    insuranceTokens(where: { owner: $address }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n"): typeof import('./graphql').OwnedInsuranceTokensDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Policy {\n    policies {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').PolicyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OpenPolicy($currentTimestamp: String!) {\n    policies(\n      where: { expiration_gt: $currentTimestamp, open: true, inventory_gt: \"0\" }\n    ) {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').OpenPolicyDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
