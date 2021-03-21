import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLSchema as SchemaType
} from "graphql"
const app = express();




// Root Query - Root of all the Queries in Documentation. Just like Menu in a restaurant. Eg Snaks, Drinks 
const RootQuery = new ObjectType({
    name: 'RootQuery',
    description: "Root Query type",
    fields: () => ({
        getPosts : {
            type : StringType,
            resolve(parent, args) {
                return "Hello World"
            }
        }
    })
})



// Schema - A Map used to make Queries, The schema is a container of your type hierarchy. RootQueryType and RootMutationType 
const schema = new SchemaType({
    name: "Schema",
    description: "A test schema for testing",
    query: RootQuery
})

// GraphQL Setup
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
}))


// App 
const port = 3000;
app.listen(port, () => console.log(`App is Running on PORT ${port}`))