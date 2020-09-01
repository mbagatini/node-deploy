import path from 'path';

export default {
  tempoExpiracaoTokenAtivacaoEmHoras: 2,
  emailTemplateFile: path.resolve(
    __dirname,
    '..',
    'modules',
    'usuarios',
    'templates',
    'esqueceu_senha.hbs',
  ),
  rotaParaOLink: 'http://localhost:3000/senha/resetar',
};
