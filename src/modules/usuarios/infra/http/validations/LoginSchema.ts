import Joi from '@hapi/joi';

export const LoginSchema = {
  realizaLogin: Joi.object().keys({
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
  }),
};
