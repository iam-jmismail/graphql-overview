import express from "express";
import { graphqlHTTP } from "express-graphql";
import axios from "axios";
import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLSchema as SchemaType,
    GraphQLList as ListType,
} from "graphql"
const app = express();


// Types 
const PostType = new ObjectType({
    name: 'PostType',
    description: 'type for Posts',
    fields: () => ({
        title: { type: StringType },
        id: { type: IntType },
        body: { type: StringType },
        userId: { type: IntType },
        user: {
            type: UserType,
            async resolve(parent, args) {
                const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`);
                return data;
            }
        }
    })
})

const UserType = new ObjectType({
    name: 'UserType',
    description: 'UserType',
    fields: () => ({
        id: { type: IntType },
        name: { type: StringType },
        username: { type: StringType },
        email: { type: StringType },
        phone: { type: StringType },
        website: { type: StringType },
        posts: {
            type: new ListType(PostType),
            async resolve(parent, args) {
                const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
                const userPosts = data.filter(post => post.userId === parent.id)
                return userPosts;
            }
        }
    })
})


// Root Query - Root of all the Queries in Documentation. Just like Menu in a restaurant. Eg Snaks, Drinks 
const RootQueryType = new ObjectType({
    name: 'RootQuery',
    description: "Root Query type",
    fields: () => ({
        getPosts: {
            type: new ListType(PostType),
            async resolve(parent, args) {
                const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
                return data
            }
        },
        getPost: {
            type: PostType,
            args: {
                id: { type: IntType },
            },
            async resolve(parent, args) {
                const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${args.id}`);
                return data
            }
        },
        getUsers: {
            type: new ListType(UserType),
            async resolve(parent, args) {
                const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
                return data
            }
        },
        getUser: {
            type: UserType,
            args: {
                id: { type: IntType },
            },
            async resolve(parent, args) {
                const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${args.id}`);
                return data;
            }
        },
    })
})


// Schema - A Map used to make Queries, The schema is a container of your type hierarchy. RootQueryType and RootMutationType 
const schema = new SchemaType({
    name: "Schema",
    description: "A test schema for testing",
    query: RootQueryType
})

// GraphQL Setup
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
}))


// App 
const port = 3000;
app.listen(port, () => console.log(`App is Running on PORT ${port}, Ctrl + Click  : http://localhost:${port}/graphql`))