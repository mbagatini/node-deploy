/* eslint-disable no-console */
import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';
import IProvedorTemplateEmail from '@shared/providers/ProvedorTemplateEmail/models/IProvedorTemplateEmail';
import IProvedorEmail from '../models/IProvedorEmail';
import IEnviaEmailDTO from '../dtos/IEnviaEmailDTO';

@injectable()
export default class EtherealProvedorEmail implements IProvedorEmail {
  private client: Transporter;

  constructor(
    @inject('ProvedorTemplateEmail')
    private provedorTemplateEmail: IProvedorTemplateEmail,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    });
  }

  public async enviaEmail({
    de,
    para,
    assunto,
    template,
  }: IEnviaEmailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: de?.nome || 'Equipe ',
        address: de?.email || 'equipe@.com.br',
      },
      to: {
        name: para.nome,
        address: para.email,
      },
      subject: assunto,
      html: await this.provedorTemplateEmail.parse(template),
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}
