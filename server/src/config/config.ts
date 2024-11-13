import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

const envValue: { [key: string]: any } = {};
let config = {
    BASE_URL: `${process.env.USE_HTTPS == 'true' ? 'https':'http'}://${process.env.HOST}${process.env.PORT == '' ? '':`:${process.env.PORT}`}`,
    env: envValue
};

for (const property in process.env) {
    config.env[property] = process.env[property]
}

export default config