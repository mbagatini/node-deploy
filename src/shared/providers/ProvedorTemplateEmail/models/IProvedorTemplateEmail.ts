import IEmailTemplateDTO from '../dtos/IEmailTemplateDTO';

export default interface IProvedorTemplateEmail {
  parse(data: IEmailTemplateDTO): Promise<string>;
}
