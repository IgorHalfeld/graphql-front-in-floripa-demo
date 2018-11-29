import express from 'express'
import { createServer } from 'http'
import { PubSub } from 'apollo-server'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const pubsub = new PubSub()
const TYPES = {
  CAPTURED_IMAGE: 'CAPTURED_IMAGE'
}

const typeDefs = gql`
  type Message {
    status: String,
    message: String
  }
  type Image {
    image: String
  }
  type Query {
    status: Message
  }
  type Mutation {
    sendImage(base64: String): Message
  }
  type Subscription {
    capturedImage: Image
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    sendImage: (root, { base64 }) => {
      pubsub.publish(TYPES.CAPTURED_IMAGE, { capturedImage: { image: base64 } })
      return {
        status: 'ok',
        message: 'Image received'
      }
    }
  },
  Subscription: {
    capturedImage: {
      subscribe: () => pubsub.asyncIterator(TYPES.CAPTURED_IMAGE)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: true,
})

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql')
})
