const config = {
    database: {
        url: process.env.DATABASE_URL as string,
    },
    oauth: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    s3: {
        region: process.env.AWS_REGION as string,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
};

if (!config.database.url) {
    throw new Error("DATABASE_URL is not set");
}

if (!config.oauth.github.clientId || !config.oauth.github.clientSecret) {
    throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set");
}

if (!config.s3.region || !config.s3.accessKeyId || !config.s3.secretAccessKey) {
    throw new Error("AWS S3 config is not set");
}

export default config;
