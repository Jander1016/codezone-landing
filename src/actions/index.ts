import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  sendMail: defineAction({
    accept: "form",
    handler: async (formData) => {

      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const message = formData.get("message") as string;

      const { data, error } = await resend.emails.send({
        from: "CodeZone <onboarding@resend.dev>",
        replyTo: email,
        to: [import.meta.env.CODEZONE_EMAIL],
        subject: "CodeZone - Solicitud de cliente",
        html: `
          <h1>Solicitud de cliente</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return {
        success: true,
        message: "Email sent successfully",
        data
      };

    }
  })
}