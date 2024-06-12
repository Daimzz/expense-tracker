import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildContext } from "graphql-passport";
import dotenv from "dotenv";
import {connectDB} from "./db/connectDB.js";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import {configurePassport} from "./passport/passport.config.js";

dotenv.config()
configurePassport()

const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
	uri: process.env.MONGO_URL,
	collection: "sessions",
})
store.on('error', (error) => {
	console.log(error)
})

app.use(session({
	secret: 'keyboard cat',
	resave: false, //save session on every request
	saveUninitialized: false,
	store: store,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, //expires at 7 days
		httpOnly: true
	}
}))

app.use(passport.initialize());
app.use(passport.session());

 const server = new ApolloServer({
	 typeDefs: mergedTypeDefs,
	 resolvers: mergedResolvers,
	 plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
 });

await server.start();

app.use(
	'/',
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
	express.json(),
	// expressMiddleware accepts the same arguments:
	// an Apollo Server instance and optional configuration options
	expressMiddleware(server, {
		context: async ({ req,res }) => buildContext({ req,res }),
	}),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB()

console.log(`🚀 Server ready at http://localhost:4000/`);

