import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateTweetPayload {

    content: string
    imageURL?: string
}

const queries: any = {
    getAllTweets: () =>  prismaClient.tweet.findMany ({orderBy: { createdAt: 'desc' } })
}

const mutation = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetPayload}, ctx: GraphqlContext) => {
        if(!ctx.user) throw new Error("You are not authenticated STFU. Kela lega tu mera");
        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: {connect: {id: ctx.user.id}},  
            }
        });
        return tweet;
    }
}

const extraResolvers = {
    Tweet : {
        author: (parent: Tweet) => prismaClient.user.findUnique({ where: { id: parent.authorId } })
    }
}

export const resolvers  = { mutation , extraResolvers , queries }