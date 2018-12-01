const express = require('express')
const bodyParser = require('body-parser')
const { createServer } = require('http')
const { PubSub } = require('apollo-server')
const { ApolloServer, gql } = require('apollo-server-express')

const app = express()
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
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
  bodyParser: { limit: '2mb' }
})

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: process.env.PORT || 80 })
console.log('Apollo Server on http://localhost:8000/graphql')

module.exports = httpServer