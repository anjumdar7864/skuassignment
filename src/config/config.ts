import dotenv from "dotenv";
import Joi from "joi";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("pod", "dev", "stage", "test").optional(),
    MONGO_URI: Joi.string().optional().description("Mongodb URI is optional"),
    PORT: Joi.number().optional().description("Port is optional"),
    JWT_SECRET: Joi.string().optional().description("JWT Secret is optional"),
    ROOT_PATH: Joi.string().optional().description("Root Path is optional"),
    JWT_EXPIRATION_ACCESS: Joi.string()
      .optional()
      .description("JWT Expiration time is optional!"),
    JWT_EXPIRATION_REFRESH: Joi.string()
      .optional()
      .description("JWT Expiration time is optional!"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: { label: "key" },
  })
  .validate(process.env);

if (error) {
  throw new Error(`Config validations error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtScret: envVars.JWT_SECRET,
  jwtExpirationAccess: envVars.JWT_EXPIRATION_ACCESS,
  jwtExpirationRefresh: envVars.JWT_EXPIRATION_REFRESH,
  rootPath: envVars.ROOT_PATH,
  mongoose: {
    url: envVars.MONGO_URI + (envVars.NODE_ENV === "test" ? "-test" : ""),
  },
};

export default config;
