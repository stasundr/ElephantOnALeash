module.exports = {
    port: process.env.PORT || 3000,
    directory: __dirname,
    cryptoSalt: process.env.CRYPTO_SALT || 'hldkf;kl@#$gdlfksd(_#)@#lsdk;dfhdcv sdd23df_dlfsdglfKGJSDLKf239rigjKJD:KLdglksdlskdfakdghsldn',
    sessionSecret: process.env.SESSION_SECRET || '#34N4THAGCVB220GJNO45773FLDHCB371H2RBFDJXNCLFH37THGOTSDC65KSUDBCR7QOQWSLCZQJBV',

    redisPort: process.env.REDIS_PORT || 6379,
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisAuth: process.env.REDIS_AUTH || null
};