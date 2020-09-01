import IEnviaEmailDTO from '@shared/providers/ProvedorEmail/dtos/IEnviaEmailDTO';
import IEmailTemplateDTO from '../dtos/IEmailTemplateDTO';
import IProvedorTemplateEmail from '../models/IProvedorTemplateEmail';

export default class FakeProvedorTemplateEmail
  implements IProvedorTemplateEmail {
  public async parse(content: IEmailTemplateDTO): Promise<string> {
    return 'Mail Content';
  }
}
