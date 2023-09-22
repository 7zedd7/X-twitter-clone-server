import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "../clients/db";
import cors from "cors";

import { User } from './user'
import { Tweet } from "./tweet"
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

export async function initServer() {
    const app = express();

    app.use(bodyParser.json());

    app.use(cors());
    
    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
        ${User.types}
        ${Tweet.types}
            type Query{
                ${User.queries}
                ${Tweet.queries }
            }
            type Mutation {
                ${Tweet.mutation}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
            },
            Mutation: {
                ...Tweet.resolvers.mutation,
            },
            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        },
    });

    await graphqlServer.start();

    app.use("/graphql", expressMiddleware(graphqlServer, {context: async({req , res}) => {
        return {
            user: req.headers.authorization? JWTService.decodeToken(req.headers.authorization.split("Bearer ")[1]) : undefined,
        }
    }}));

    return app;
}
