"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const types_1 = require("./types");
const queries_1 = require("./queries");
const mutations_1 = require("./mutations");
const resolvers_1 = require("./resolvers");
exports.Tweet = { types: types_1.types, mutation: mutations_1.mutation, resolvers: resolvers_1.resolvers, queries: queries_1.queries };
