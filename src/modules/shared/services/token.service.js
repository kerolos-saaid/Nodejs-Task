import envVariables from "../../../config/envVariables.js";
import * as tokenUtils from "../../../utils/Token.js";

const tokenConfig = envVariables.TokenConfig;

export const generateAuthToken = async (obj = {}) => {
  return tokenUtils.createToken(
    obj,
    tokenConfig.AUTH_SIGNATURE,
    tokenConfig.AUTH_EXPIRE_TIME
  );
};

export const decodeAuthToken = async (token) => {
  return tokenUtils.decodeToken(token, tokenConfig.AUTH_SIGNATURE);
};
