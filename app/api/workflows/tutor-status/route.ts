import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type TutorStatusPayload = {
  type: "APPROVAL" | "REJECTION";
  email: string;
  fullName: string;
  reason?: string;
};

export const { POST } = serve<TutorStatusPayload>(async (context) => {
  const { type, email, fullName, reason } = context.requestPayload;

  if (type === "APPROVAL") {
    await context.run("send-approval-email", async () => {
      await sendEmail({
        email,
        subject: "🎉 Congratulations! Your Grammerwise Application Has Been Approved",
        message: `
          <h1>Congratulations, ${fullName}!</h1>
          <p>Your tutor application for Grammerwise has been approved.</p>
          <p>The next step is to set up your payment details so you can start getting paid for your work.</p>
          <p>Please log in to your dashboard to complete the final step.</p>
          <p>Welcome to the team!</p>
        `,
      });
    });
  } else if (type === "REJECTION") {
    await context.run("send-rejection-email", async () => {
      await sendEmail({
        email,
        subject: "Update on Your Grammerwise Application",
        message: `
          <h1>Update on Your Application</h1>
          <p>Hi ${fullName},</p>
          <p>Thank you for your interest in becoming a tutor with Grammerwise.</p>
          <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
          <p><strong>Reason:</strong> ${reason || "Does not meet current requirements."}</p>
          <p>We encourage you to apply again in the future if you gain more experience or qualifications.</p>
          <p>Thank you again for your time.</p>
        `,
      });
    });
  }
});
