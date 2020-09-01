import Joi from '@hapi/joi';

export const CadastroSchema = {
  ativacaoCadastro: Joi.object().keys({
    token: Joi.string().uuid().required(),
  }),
};
