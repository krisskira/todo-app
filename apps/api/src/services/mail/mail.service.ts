import Config from '@api/core/config'
import nodemailer from 'nodemailer'
export class MailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: Config.mail.host,
      port: Config.mail.port,
      secure: true,
      auth: {
        user: Config.mail.user,
        pass: Config.mail.pass
      }
    })
  }

  async sendMail(to: string, subject: string, html: string, from = ''): Promise<void> {
    if (!from) from = `"Support To Do" <${Config.mail.user}>`
    await this.transporter.sendMail({
      from,
      to,
      subject,
      html
    })
  }
}
