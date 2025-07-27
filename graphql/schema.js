import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    email: String!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    createdAt: Date!
    user: User!
  }

  type Query {
    notes(
      userId: ID
      title: String
      startDate: Date
      endDate: Date
      page: Int
      limit: Int
    ): [Note]
  }

  type Mutation {
    addNote(title: String!, content: String!): Note
    deleteNote(id: ID!): Boolean
  }
`;

export default typeDefs;
