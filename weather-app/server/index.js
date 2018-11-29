const { GraphQLServer } = require('graphql-yoga')
const {
  typeDefs,
  resolvers
} = require('./schema')

const server = new GraphQLServer({ typeDefs, resolvers })

const options = {
  port: 3000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  ),
)