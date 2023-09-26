const config = {};

config.serviceName = 'profile';

config.debug = process.env.NODE_DEBUG === 'true';

config.PORT = +process.env.PORT || 8081;

config.logger = {
    level: 'debug',
};

config.profileAPI = {
    root: 'api',
    version: 'v1',
    url: 'profile',
    getUrl: function() { return `/${this.root}/${this.version}/${this.url}` },
};

config.aws = {
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsAccessSecret: process.env.AWS_ACCCESS_KEY_SECRET,
    awsRegion: process.env.AWS_REGION,
};

config.aws.cloudwatch = {
    awsAccessKey: process.env.AWS_CLOUDWATCH_ACCESS_KEY_ID,
    awsAccessSecret: process.env.AWS_CLOUDWATCH_ACCESS_KEY_SECRET,
    awsRegion: process.env.AWS_CLOUDWATCH_REGION,
    awsLogGroupName: process.env.AWS_CLOUDWATCH_LOGS_GROUPNAME,
    awsLogsStreamName: process.env.AWS_CLOUDWATCH_LOGS_STREAM,
};

config.aws.s3 = {
    bucket: process.env.AWS_S3_BUCKET,
};

config.db = {
    mongo: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST,
        dbName: process.env.MONGODB_DB_NAME,
        getURI() {
            return `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.dbName}?retryWrites=true`
        }
    }
};

config.authEndpoint = process.env.AUTH_SERVICE_ENDPOINT;

module.exports = config;
