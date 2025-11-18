/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  /** 8 bytes signed integer */
  Int8: { input: any; output: any; }
  /** A string representation of microseconds UNIX timestamp (16 digits) */
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Flight = {
  __typename?: 'Flight';
  delay?: Maybe<Scalars['String']['output']>;
  flightDate: Scalars['String']['output'];
  flightNumber: Scalars['String']['output'];
  id: Scalars['String']['output'];
  policies: Array<Policy>;
  requestedAt?: Maybe<Scalars['String']['output']>;
  settled: Scalars['Boolean']['output'];
};


export type FlightPoliciesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Policy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Policy_Filter>;
};

export type Flight_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Flight_Filter>>>;
  delay?: InputMaybe<Scalars['String']['input']>;
  delay_contains?: InputMaybe<Scalars['String']['input']>;
  delay_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delay_ends_with?: InputMaybe<Scalars['String']['input']>;
  delay_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delay_gt?: InputMaybe<Scalars['String']['input']>;
  delay_gte?: InputMaybe<Scalars['String']['input']>;
  delay_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delay_lt?: InputMaybe<Scalars['String']['input']>;
  delay_lte?: InputMaybe<Scalars['String']['input']>;
  delay_not?: InputMaybe<Scalars['String']['input']>;
  delay_not_contains?: InputMaybe<Scalars['String']['input']>;
  delay_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delay_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delay_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delay_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delay_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delay_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delay_starts_with?: InputMaybe<Scalars['String']['input']>;
  delay_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate?: InputMaybe<Scalars['String']['input']>;
  flightDate_contains?: InputMaybe<Scalars['String']['input']>;
  flightDate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate_ends_with?: InputMaybe<Scalars['String']['input']>;
  flightDate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate_gt?: InputMaybe<Scalars['String']['input']>;
  flightDate_gte?: InputMaybe<Scalars['String']['input']>;
  flightDate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flightDate_lt?: InputMaybe<Scalars['String']['input']>;
  flightDate_lte?: InputMaybe<Scalars['String']['input']>;
  flightDate_not?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_contains?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flightDate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flightDate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightDate_starts_with?: InputMaybe<Scalars['String']['input']>;
  flightDate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber?: InputMaybe<Scalars['String']['input']>;
  flightNumber_contains?: InputMaybe<Scalars['String']['input']>;
  flightNumber_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber_ends_with?: InputMaybe<Scalars['String']['input']>;
  flightNumber_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber_gt?: InputMaybe<Scalars['String']['input']>;
  flightNumber_gte?: InputMaybe<Scalars['String']['input']>;
  flightNumber_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flightNumber_lt?: InputMaybe<Scalars['String']['input']>;
  flightNumber_lte?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_contains?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flightNumber_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flightNumber_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flightNumber_starts_with?: InputMaybe<Scalars['String']['input']>;
  flightNumber_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Flight_Filter>>>;
  policies_?: InputMaybe<Policy_Filter>;
  requestedAt?: InputMaybe<Scalars['String']['input']>;
  requestedAt_contains?: InputMaybe<Scalars['String']['input']>;
  requestedAt_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  requestedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  requestedAt_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  requestedAt_gt?: InputMaybe<Scalars['String']['input']>;
  requestedAt_gte?: InputMaybe<Scalars['String']['input']>;
  requestedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  requestedAt_lt?: InputMaybe<Scalars['String']['input']>;
  requestedAt_lte?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  requestedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  requestedAt_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  requestedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  requestedAt_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  settled?: InputMaybe<Scalars['Boolean']['input']>;
  settled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  settled_not?: InputMaybe<Scalars['Boolean']['input']>;
  settled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export enum Flight_OrderBy {
  Delay = 'delay',
  FlightDate = 'flightDate',
  FlightNumber = 'flightNumber',
  Id = 'id',
  Policies = 'policies',
  RequestedAt = 'requestedAt',
  Settled = 'settled'
}

export type InsuranceToken = {
  __typename?: 'InsuranceToken';
  id: Scalars['ID']['output'];
  listedPrice?: Maybe<Scalars['String']['output']>;
  owner: Scalars['String']['output'];
  policy: Policy;
  processed: Scalars['Boolean']['output'];
};

export type InsuranceToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InsuranceToken_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  listedPrice?: InputMaybe<Scalars['String']['input']>;
  listedPrice_contains?: InputMaybe<Scalars['String']['input']>;
  listedPrice_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listedPrice_ends_with?: InputMaybe<Scalars['String']['input']>;
  listedPrice_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listedPrice_gt?: InputMaybe<Scalars['String']['input']>;
  listedPrice_gte?: InputMaybe<Scalars['String']['input']>;
  listedPrice_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listedPrice_lt?: InputMaybe<Scalars['String']['input']>;
  listedPrice_lte?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_contains?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listedPrice_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  listedPrice_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listedPrice_starts_with?: InputMaybe<Scalars['String']['input']>;
  listedPrice_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<InsuranceToken_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  policy?: InputMaybe<Scalars['String']['input']>;
  policy_?: InputMaybe<Policy_Filter>;
  policy_contains?: InputMaybe<Scalars['String']['input']>;
  policy_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  policy_ends_with?: InputMaybe<Scalars['String']['input']>;
  policy_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  policy_gt?: InputMaybe<Scalars['String']['input']>;
  policy_gte?: InputMaybe<Scalars['String']['input']>;
  policy_in?: InputMaybe<Array<Scalars['String']['input']>>;
  policy_lt?: InputMaybe<Scalars['String']['input']>;
  policy_lte?: InputMaybe<Scalars['String']['input']>;
  policy_not?: InputMaybe<Scalars['String']['input']>;
  policy_not_contains?: InputMaybe<Scalars['String']['input']>;
  policy_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  policy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  policy_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  policy_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  policy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  policy_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  policy_starts_with?: InputMaybe<Scalars['String']['input']>;
  policy_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  processed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  processed_not?: InputMaybe<Scalars['Boolean']['input']>;
  processed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export enum InsuranceToken_OrderBy {
  Id = 'id',
  ListedPrice = 'listedPrice',
  Owner = 'owner',
  Policy = 'policy',
  PolicyDelayThreshold = 'policy__delayThreshold',
  PolicyExpiration = 'policy__expiration',
  PolicyId = 'policy__id',
  PolicyInventory = 'policy__inventory',
  PolicyOpen = 'policy__open',
  PolicyPayout = 'policy__payout',
  PolicyPrice = 'policy__price',
  Processed = 'processed'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Policy = {
  __typename?: 'Policy';
  delayThreshold: Scalars['String']['output'];
  expiration: Scalars['String']['output'];
  flight: Flight;
  id: Scalars['ID']['output'];
  insuredTokens: Array<InsuranceToken>;
  inventory: Scalars['String']['output'];
  open: Scalars['Boolean']['output'];
  payout: Scalars['String']['output'];
  price: Scalars['String']['output'];
};


export type PolicyInsuredTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InsuranceToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InsuranceToken_Filter>;
};

export type Policy_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Policy_Filter>>>;
  delayThreshold?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_contains?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_ends_with?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_gt?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_gte?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delayThreshold_lt?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_lte?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_contains?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delayThreshold_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_starts_with?: InputMaybe<Scalars['String']['input']>;
  delayThreshold_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration?: InputMaybe<Scalars['String']['input']>;
  expiration_contains?: InputMaybe<Scalars['String']['input']>;
  expiration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration_ends_with?: InputMaybe<Scalars['String']['input']>;
  expiration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration_gt?: InputMaybe<Scalars['String']['input']>;
  expiration_gte?: InputMaybe<Scalars['String']['input']>;
  expiration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  expiration_lt?: InputMaybe<Scalars['String']['input']>;
  expiration_lte?: InputMaybe<Scalars['String']['input']>;
  expiration_not?: InputMaybe<Scalars['String']['input']>;
  expiration_not_contains?: InputMaybe<Scalars['String']['input']>;
  expiration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  expiration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  expiration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  expiration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiration_starts_with?: InputMaybe<Scalars['String']['input']>;
  expiration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flight?: InputMaybe<Scalars['String']['input']>;
  flight_?: InputMaybe<Flight_Filter>;
  flight_contains?: InputMaybe<Scalars['String']['input']>;
  flight_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flight_ends_with?: InputMaybe<Scalars['String']['input']>;
  flight_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flight_gt?: InputMaybe<Scalars['String']['input']>;
  flight_gte?: InputMaybe<Scalars['String']['input']>;
  flight_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flight_lt?: InputMaybe<Scalars['String']['input']>;
  flight_lte?: InputMaybe<Scalars['String']['input']>;
  flight_not?: InputMaybe<Scalars['String']['input']>;
  flight_not_contains?: InputMaybe<Scalars['String']['input']>;
  flight_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flight_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flight_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flight_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flight_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flight_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flight_starts_with?: InputMaybe<Scalars['String']['input']>;
  flight_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  insuredTokens_?: InputMaybe<InsuranceToken_Filter>;
  inventory?: InputMaybe<Scalars['String']['input']>;
  inventory_contains?: InputMaybe<Scalars['String']['input']>;
  inventory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inventory_ends_with?: InputMaybe<Scalars['String']['input']>;
  inventory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inventory_gt?: InputMaybe<Scalars['String']['input']>;
  inventory_gte?: InputMaybe<Scalars['String']['input']>;
  inventory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inventory_lt?: InputMaybe<Scalars['String']['input']>;
  inventory_lte?: InputMaybe<Scalars['String']['input']>;
  inventory_not?: InputMaybe<Scalars['String']['input']>;
  inventory_not_contains?: InputMaybe<Scalars['String']['input']>;
  inventory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inventory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  inventory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inventory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inventory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  inventory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inventory_starts_with?: InputMaybe<Scalars['String']['input']>;
  inventory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  open?: InputMaybe<Scalars['Boolean']['input']>;
  open_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  open_not?: InputMaybe<Scalars['Boolean']['input']>;
  open_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Policy_Filter>>>;
  payout?: InputMaybe<Scalars['String']['input']>;
  payout_contains?: InputMaybe<Scalars['String']['input']>;
  payout_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  payout_ends_with?: InputMaybe<Scalars['String']['input']>;
  payout_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  payout_gt?: InputMaybe<Scalars['String']['input']>;
  payout_gte?: InputMaybe<Scalars['String']['input']>;
  payout_in?: InputMaybe<Array<Scalars['String']['input']>>;
  payout_lt?: InputMaybe<Scalars['String']['input']>;
  payout_lte?: InputMaybe<Scalars['String']['input']>;
  payout_not?: InputMaybe<Scalars['String']['input']>;
  payout_not_contains?: InputMaybe<Scalars['String']['input']>;
  payout_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  payout_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  payout_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  payout_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  payout_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  payout_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  payout_starts_with?: InputMaybe<Scalars['String']['input']>;
  payout_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  price_contains?: InputMaybe<Scalars['String']['input']>;
  price_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  price_ends_with?: InputMaybe<Scalars['String']['input']>;
  price_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price_gt?: InputMaybe<Scalars['String']['input']>;
  price_gte?: InputMaybe<Scalars['String']['input']>;
  price_in?: InputMaybe<Array<Scalars['String']['input']>>;
  price_lt?: InputMaybe<Scalars['String']['input']>;
  price_lte?: InputMaybe<Scalars['String']['input']>;
  price_not?: InputMaybe<Scalars['String']['input']>;
  price_not_contains?: InputMaybe<Scalars['String']['input']>;
  price_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  price_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  price_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  price_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  price_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price_starts_with?: InputMaybe<Scalars['String']['input']>;
  price_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Policy_OrderBy {
  DelayThreshold = 'delayThreshold',
  Expiration = 'expiration',
  Flight = 'flight',
  FlightDelay = 'flight__delay',
  FlightFlightDate = 'flight__flightDate',
  FlightFlightNumber = 'flight__flightNumber',
  FlightId = 'flight__id',
  FlightRequestedAt = 'flight__requestedAt',
  FlightSettled = 'flight__settled',
  Id = 'id',
  InsuredTokens = 'insuredTokens',
  Inventory = 'inventory',
  Open = 'open',
  Payout = 'payout',
  Price = 'price'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  flight?: Maybe<Flight>;
  flights: Array<Flight>;
  insuranceToken?: Maybe<InsuranceToken>;
  insuranceTokens: Array<InsuranceToken>;
  policies: Array<Policy>;
  policy?: Maybe<Policy>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryFlightArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFlightsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flight_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Flight_Filter>;
};


export type QueryInsuranceTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInsuranceTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InsuranceToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InsuranceToken_Filter>;
};


export type QueryPoliciesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Policy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Policy_Filter>;
};


export type QueryPolicyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type ListedInsuranceTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type ListedInsuranceTokensQuery = { __typename?: 'Query', insuranceTokens: Array<{ __typename?: 'InsuranceToken', id: string, owner: string, listedPrice?: string | null, processed: boolean, policy: { __typename?: 'Policy', id: string, payout: string, delayThreshold: string, expiration: string, inventory: string, open: boolean, price: string, flight: { __typename?: 'Flight', flightNumber: string, flightDate: string, settled: boolean, requestedAt?: string | null, delay?: string | null } } }> };

export type OwnedInsuranceTokensQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type OwnedInsuranceTokensQuery = { __typename?: 'Query', insuranceTokens: Array<{ __typename?: 'InsuranceToken', id: string, owner: string, listedPrice?: string | null, processed: boolean, policy: { __typename?: 'Policy', id: string, payout: string, delayThreshold: string, expiration: string, inventory: string, open: boolean, price: string, flight: { __typename?: 'Flight', flightNumber: string, flightDate: string, settled: boolean, requestedAt?: string | null, delay?: string | null } } }> };

export type PolicyQueryVariables = Exact<{ [key: string]: never; }>;


export type PolicyQuery = { __typename?: 'Query', policies: Array<{ __typename?: 'Policy', id: string, payout: string, delayThreshold: string, expiration: string, inventory: string, open: boolean, price: string, flight: { __typename?: 'Flight', id: string, flightNumber: string, flightDate: string, settled: boolean, requestedAt?: string | null, delay?: string | null }, insuredTokens: Array<{ __typename?: 'InsuranceToken', id: string }> }> };

export type OpenPolicyQueryVariables = Exact<{
  currentTimestamp: Scalars['String']['input'];
}>;


export type OpenPolicyQuery = { __typename?: 'Query', policies: Array<{ __typename?: 'Policy', id: string, payout: string, delayThreshold: string, expiration: string, inventory: string, open: boolean, price: string, flight: { __typename?: 'Flight', id: string, flightNumber: string, flightDate: string, settled: boolean, requestedAt?: string | null, delay?: string | null }, insuredTokens: Array<{ __typename?: 'InsuranceToken', id: string }> }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const ListedInsuranceTokensDocument = new TypedDocumentString(`
    query listedInsuranceTokens {
  insuranceTokens(where: {listedPrice_not: null}) {
    id
    owner
    listedPrice
    processed
    policy {
      id
      flight {
        flightNumber
        flightDate
        settled
        requestedAt
        delay
      }
      payout
      delayThreshold
      expiration
      inventory
      open
      price
    }
  }
}
    `) as unknown as TypedDocumentString<ListedInsuranceTokensQuery, ListedInsuranceTokensQueryVariables>;
export const OwnedInsuranceTokensDocument = new TypedDocumentString(`
    query ownedInsuranceTokens($address: String!) {
  insuranceTokens(where: {owner: $address}) {
    id
    owner
    listedPrice
    processed
    policy {
      id
      flight {
        flightNumber
        flightDate
        settled
        requestedAt
        delay
      }
      payout
      delayThreshold
      expiration
      inventory
      open
      price
    }
  }
}
    `) as unknown as TypedDocumentString<OwnedInsuranceTokensQuery, OwnedInsuranceTokensQueryVariables>;
export const PolicyDocument = new TypedDocumentString(`
    query Policy {
  policies {
    id
    flight {
      id
      flightNumber
      flightDate
      settled
      requestedAt
      delay
    }
    payout
    delayThreshold
    expiration
    inventory
    open
    price
    insuredTokens {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<PolicyQuery, PolicyQueryVariables>;
export const OpenPolicyDocument = new TypedDocumentString(`
    query OpenPolicy($currentTimestamp: String!) {
  policies(
    where: {expiration_gt: $currentTimestamp, open: true, inventory_gt: "0"}
  ) {
    id
    flight {
      id
      flightNumber
      flightDate
      settled
      requestedAt
      delay
    }
    payout
    delayThreshold
    expiration
    inventory
    open
    price
    insuredTokens {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<OpenPolicyQuery, OpenPolicyQueryVariables>;