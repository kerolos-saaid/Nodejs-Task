import { tokenConfig } from "../../../config/envVariables";
import tokenUtils from "../../../utils/Token";

export const generateAuthToken = async (obj = {}) => {
  return await tokenUtils.createToken(
    obj,
    tokenConfig.AUTH_SIGNATURE,
    tokenConfig.AUTH_EXPIRE_TIME
  );
};

export const decodeAuthToken = async (token) => {
  return await tokenUtils.decodeToken(token, tokenConfig.AUTH_SIGNATURE);
};
