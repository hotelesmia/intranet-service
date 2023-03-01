// Read environment variables
import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 3030,
  ALLOW_LIST_HOSTS: process.env.ALLOW_LIST_HOSTS || '',
  AUTH_API_URL: process.env.AUTH_API_URL || '',
  SOCIAL_API: process.env.SOCIAL_API || '',
  S3_ENDPOINT: process.env.S3_ENDPOINT || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
  S3_FILES_SRC: process.env.S3_FILES_SRC || ''
};

export default configurations;