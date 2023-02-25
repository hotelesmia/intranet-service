// Read environment variables
import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 3030,
  ALLOW_LIST_HOSTS: process.env.ALLOW_LIST_HOSTS || '',
  AUTH_API_URL: process.env.AUTH_API_URL || '',
  SOCIAL_API: process.env.SOCIAL_API || '',
  DO_ENDPOINT: process.env.DO_ENDPOINT || '',
  DO_BUCKET: process.env.DO_BUCKET || '',
  DO_ACCESS_KEY_ID: process.env.DO_ACCESS_KEY_ID || '',
  DO_SECRET_ACCESS_KEY: process.env.DO_SECRET_ACCESS_KEY || '',
  DO_SPACE_CV_FILES_SRC: process.env.DO_SPACE_CV_FILES_SRC || ''
};

export default configurations;