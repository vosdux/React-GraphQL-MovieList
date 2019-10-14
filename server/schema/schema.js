const graphql = require('graphql');

const { GraphQLID, GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

// const movies = [
//     { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1' }, //5d99a4c7844731437f7e4b08
//     { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2' }, //5d99a5031c9d44000047d738
//     { id: '3', name: 'V fro vendetta', genre: 'Sci-Fi-Triller', directorId: '3' }, //5d99a5381c9d44000047d73a
//     { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4' }, //5d99a54d1c9d44000047d73c
//     { id: '5', name: 'Snatch', genre: 'Crime', directorId: '1' }, //5d99a4c7844731437f7e4b08
//     { id: '6', name: 'Snatch', genre: 'Crime', directorId: '1' }, //5d99a4c7844731437f7e4b08
//     { id: '7', name: 'Snatch', genre: 'Crime', directorId: '1' }, //5d99a4c7844731437f7e4b08
//     { id: '8', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4' }, //5d99a54d1c9d44000047d73c
// ];

// const moviesJSON = [
//     { "name": "Pulp Fiction", "genre": "Crime", "directorId": "5d99d44071a5443fa853dc39" },
//     { "name": "1984', "genre": "Sci-Fi", "directorId": "5d99d49771a5443fa853dc3a" },
//     { "name": "V fro vendetta", "genre": "Sci-Fi-Triller", "directorId": "5d99d54b71a5443fa853dc3b" },
//     { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5d99d56471a5443fa853dc3c" },
//     { "name": "The hateful eight", "genre": "Crime", "directorI": "5d99d44071a5443fa853dc39" },
//     { "name": "Inglorious basterds", "genre": "Crime", "directorI": "5d99d44071a5443fa853dc39" },
//     { "name": "Reservoir dogs", "genre": "Crime", "directorI": "5d99d44071a5443fa853dc39" },
//     { "name": "Lock, stock and two smoking barrels", "genre": "Crime-Comedy", "directorId": "5d99d56471a5443fa853dc3c" }
// ];

// const directors = [
//     { id: '1', name: 'Quentin Tarantino', age: 55 },
//     { id: '2', name: 'Michael Radford', age: 72 },
//     { id: '3', name: 'James McTeigue', age: 51 },
//     { id: '4', name: 'Guy Ritchie', age: 50 }
// ]

// const directorsJSON = [
//     { "name": "Quentin Tarantino", "age": 55 },
//     { "name": "Michael Radford", "age": 72 },
//     { "name": "James McTeigue", "age": 51 },
//     { "name": "Guy Ritchie", "age": 50 }
// ]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id === parent.id);
                return Directors.findById(parent.directorId);
            }
        },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId === parent.id)
                return Movies.find({ directorId: parent.id });
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age
                });
                director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name:  { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString)},
                directorId: { type: GraphQLID },
                rate: { type: GraphQLInt },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                    rate: args.rate,
                    watched: args.watched
                });
                return movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true }
                );
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                rate: { type: GraphQLInt },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, genre: args.genre, directorId: args.directorId, rate: args.rate, watched: args.watched } },
                    { new: true }
                );
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id === args.id)
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id === args.id)
                return Directors.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});