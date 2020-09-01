/* eslint-disable import/no-duplicates */
import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';

const JoiWithDate = Joi.extend(JoiDate);

export const UsuarioSchema = {
  criaUsuario: Joi.object().keys({
    nome: Joi.string()
      .max(255)
      .pattern(/^[a-zà-úA-ZÀ-Ú ]+$/)
      .required(),

    rg: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),

    cpf: Joi.string()
      .length(14)
      .pattern(/^[0-9.-]+$/)
      .required(),
    data_nascimento: JoiWithDate.date().format('YYYY-MM-DD').required(),

    email: Joi.string().email().max(255).required(),

    senha: Joi.string().min(6).max(255).required(),

    endereco: Joi.string().max(255).required(),

    complemento: Joi.string().max(255).optional(),

    cep: Joi.string().length(9).required(),

    bairro: Joi.string().max(255).required(),

    numero: Joi.string().max(255).optional(),

    cidade: Joi.object()
      .required()
      .keys({
        id: Joi.number().optional(),

        nome: Joi.string().required(),

        estado: Joi.object()
          .required()
          .keys({
            id: Joi.number().optional(),

            nome: Joi.string().optional(),

            uf: Joi.string().length(2).required(),
          }),
      }),
  }),

  alteraUsuario: {
    Body: Joi.object()
      .keys({
        nome: Joi.string()
          .max(255)
          .pattern(/^[a-zà-úA-ZÀ-Ú ]+$/)
          .required(),

        rg: Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required(),

        cpf: Joi.string()
          .length(14)
          .pattern(/^[0-9.-]+$/)
          .required(),
        data_nascimento: JoiWithDate.date().format('YYYY-MM-DD').required(),

        senha: Joi.string().min(6).max(255),

        senha_confirmacao: Joi.string().valid(Joi.ref('senha')),

        senha_antiga: Joi.string(),

        endereco: Joi.string().max(255).required(),

        complemento: Joi.string().max(255).optional(),

        cep: Joi.string().length(9).required(),

        bairro: Joi.string().max(255).required(),

        numero: Joi.string().max(255).optional(),

        cidade: Joi.object()
          .required()
          .keys({
            id: Joi.number().optional(),

            nome: Joi.string().required(),

            estado: Joi.object()
              .required()
              .keys({
                id: Joi.number().optional(),

                nome: Joi.string().optional(),

                uf: Joi.string().length(2).required(),
              }),
          }),
      })
      .and('senha', 'senha_antiga'),

    Params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },

  buscaUsuario: {
    Query: Joi.object()
      .keys({
        nome: Joi.string(),

        cidadeId: Joi.number(),

        cidadeNome: Joi.string(),

        uf: Joi.string().length(2),

        paginaId: Joi.number().min(1),
      })
      // or serve para que pelo menos 1 dos campos deva estar presente
      .or('nome', 'cidadeId', 'cidadeNome', 'uf'),

    Params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },
};
