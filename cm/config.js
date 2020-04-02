var config = {
    expressPort: 3000,
    client: {
        mongodb: {
            uri: "mongodb://127.0.0.1:27017",
            database: "cm",
            user : "",
            password : "",
            extraParams: "compressors=disabled&gssapiServiceName=mongodb"
        }
    },

    elasticapm: {
        serviceName: 'cm-back',
    
        secretToken: '',
    
        serverUrl: 'http://localhost:8200/'
      }
};

module.exports = config;
