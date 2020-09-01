import fs from 'fs';
import handlebars from 'handlebars';
import IProvedorTemplateEmail from '../models/IProvedorTemplateEmail';
import IEmailTemplateDTO from '../dtos/IEmailTemplateDTO';

class HandlebarsTemplateEmailProvedor implements IProvedorTemplateEmail {
  public async parse({ file, variables }: IEmailTemplateDTO): Promise<string> {
    const templateFile = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFile);
    return parseTemplate(variables);
  }
}

export default HandlebarsTemplateEmailProvedor;
