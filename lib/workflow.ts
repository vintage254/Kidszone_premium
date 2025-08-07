import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "grammerwise support<support@grammerwise.com>",
      to: [email],
      subject,
      html: message,
    },
  });
};

export const triggerTutorStatusWorkflow = async (payload: {
  type: "APPROVAL" | "REJECTION";
  email: string;
  fullName: string;
  reason?: string;
}) => {
  await qstashClient.publishJSON({
    url: `${config.env.apiEndpoint}/api/workflows/tutor-status`,
    body: payload,
  });
};
