import IProvedorTemplateEmail from '@shared/providers/ProvedorTemplateEmail/models/IProvedorTemplateEmail';
import IEmailTemplateDTO from '@shared/providers/ProvedorTemplateEmail/dtos/IEmailTemplateDTO';

interface IContato {
  nome: string;
  email: string;
}

export default interface IEnviaEmailDTO {
  de?: IContato;
  para: IContato;
  assunto: string;
  template: IEmailTemplateDTO;
}
