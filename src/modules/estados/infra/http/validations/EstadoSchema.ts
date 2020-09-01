/* eslint-disable import/no-duplicates */
import Joi from '@hapi/joi';

export const EstadoSchema = {
  body: Joi.object().keys({
    nome: Joi.string().required(),
    uf: Joi.string().required().length(2),
  }),
  query: Joi.object().keys({
    paginaId: Joi.number().optional(),
    resultadosPorPagina: Joi.number().optional(),
  }),
};
