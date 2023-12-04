export default () => ({
    jwt : {
        secret: process.env.JWT_SECRET
    },
    mongodb : {
        uri: process.env.MONGO_DB_URL
    }
});