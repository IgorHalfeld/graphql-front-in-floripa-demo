const { ObjectID } = require('mongodb')
const { readFileSync } = require('fs')

const MongoClient = require('./db')

const types = ['user', 'review', 'product']
  .map(type => readFileSync(`./schemas/${type}.graphql`, 'utf8'))
  .join()

exports.typeDefs = `
  type Query {
    user(_id: ID!): User!,
    users: [User!]!,
    product(_id: ID!): Product!
    products: [Product!]!,
  }
  ${types}
`

exports.resolvers = {
  Query: {
    user: async (root, { _id }) => {
      const { client } = await MongoClient()
      return await client
        .collection('users')
        .findOne({ _id: ObjectID(_id) })
    },
    users: async () => {
      const { client } = await MongoClient()
      return await client
        .collection('users')
        .find({})
        .toArray()
    },
    product: (root, { _id }) => {
      const product = productsModel.find(product => product.id === _id)
      product.reviews = product.reviews.map(reviewId => {
        return reviewsModel.find(review => review.id === Number(reviewId)) || {}
      })
      return product
    },
    products: async () => {
      const { client } = await MongoClient()
      const pipeline = [
        { $match: {} },
        { $lookup: {
          localField: 'reviews',
          foreignField: '_id',
          from: 'reviews',
          as: 'reviews'
        }},
        { $lookup: {
          localField: 'reviews.user',
          foreignField: '_id',
          from: 'users',
          as: 'reviews'
        }},
        { $project: {
          _id: 1,
          reviews: 1,
          price: 1,
          name: 1,
        }}
      ]
      const res = await client
        .collection('products')
        .aggregate(pipeline)
        .toArray()
      console.log('res', res)
      return res
    }
  }
}