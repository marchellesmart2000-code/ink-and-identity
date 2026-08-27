/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as campaigns from "../campaigns.js";
import type * as collections from "../collections.js";
import type * as dashboard from "../dashboard.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as journal from "../journal.js";
import type * as lib_media from "../lib/media.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as lib_quoteValidation from "../lib/quoteValidation.js";
import type * as lib_slug from "../lib/slug.js";
import type * as lib_validators from "../lib/validators.js";
import type * as notifications from "../notifications.js";
import type * as portfolio from "../portfolio.js";
import type * as products from "../products.js";
import type * as quotes from "../quotes.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as social from "../social.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  campaigns: typeof campaigns;
  collections: typeof collections;
  dashboard: typeof dashboard;
  files: typeof files;
  http: typeof http;
  journal: typeof journal;
  "lib/media": typeof lib_media;
  "lib/permissions": typeof lib_permissions;
  "lib/quoteValidation": typeof lib_quoteValidation;
  "lib/slug": typeof lib_slug;
  "lib/validators": typeof lib_validators;
  notifications: typeof notifications;
  portfolio: typeof portfolio;
  products: typeof products;
  quotes: typeof quotes;
  seed: typeof seed;
  services: typeof services;
  settings: typeof settings;
  social: typeof social;
  testimonials: typeof testimonials;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
