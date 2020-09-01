import path from 'path';

export default {
  tempoExpiracaoTokenAtivacaoEmHoras: 2,
  emailTemplateFile: path.resolve(
    __dirname,
    '..',
    'modules',
    'usuarios',
    'templates',
    'ativacao_cadastro.hbs',
  ),
  rotaParaOLink: 'http://localhost:3000/cadastro/usuario/ativar',
};
