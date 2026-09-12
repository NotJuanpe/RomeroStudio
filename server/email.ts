import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendContactNotification(message: {
  name: string;
  email: string;
  projectType: string;
  estimatedArea?: string;
  message: string;
}): Promise<{ sent: boolean; id?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    console.log('[Resend] RESEND_API_KEY no configurado en variables de entorno. Mensaje guardado en base de datos.');
    return { sent: false, error: 'RESEND_API_KEY no configurado' };
  }

  const toEmail = process.env.STUDIO_NOTIFICATION_EMAIL || 'contacto@romeroestudio.com';
  // En cuenta de prueba de Resend se utiliza onboarding@resend.dev para entregar correos verificados
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Romero Estudio <onboarding@resend.dev>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: message.email,
      subject: `Nueva Consulta de Arquitectura: ${message.name} [${message.projectType}]`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111111; background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 12px;">
          <div style="border-bottom: 2px solid #111111; padding-bottom: 12px; margin-bottom: 20px;">
            <h1 style="font-size: 20px; font-weight: 800; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">ROMERO ESTUDIO</h1>
            <p style="font-size: 11px; color: #666666; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 2px;">Arquitectura Integral • Notificación de Contacto</p>
          </div>
          
          <h2 style="font-size: 15px; font-weight: 700; margin: 0 0 16px; color: #111111;">Nueva consulta recibida a través del sitio web</h2>
          
          <div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #777777; width: 140px; font-weight: bold;">Cliente:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111111;">${message.name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #777777; font-weight: bold;">Correo:</td>
                <td style="padding: 6px 0;"><a href="mailto:${message.email}" style="color: #111111; font-weight: 600; text-decoration: underline;">${message.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #777777; font-weight: bold;">Tipología:</td>
                <td style="padding: 6px 0; font-weight: 600;">${message.projectType}</td>
              </tr>
              ${message.estimatedArea ? `
              <tr>
                <td style="padding: 6px 0; color: #777777; font-weight: bold;">Superficie Aprox:</td>
                <td style="padding: 6px 0;">${message.estimatedArea}</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 11px; color: #777777; font-weight: bold; text-transform: uppercase; margin: 0 0 8px; letter-spacing: 1px;">Mensaje / Alcance:</p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #222222; white-space: pre-wrap;">${message.message}</p>
          </div>

          <div style="text-align: center; border-top: 1px solid #e5e5e5; padding-top: 16px;">
            <p style="font-size: 10px; color: #999999; margin: 0; text-transform: uppercase; letter-spacing: 1.5px;">
              Romero Estudio CMS • Despachado mediante Resend API
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return { sent: false, error: error.message };
    }

    return { sent: true, id: data?.id };
  } catch (err: any) {
    console.error('[Resend Exception]:', err);
    return { sent: false, error: err.message };
  }
}
