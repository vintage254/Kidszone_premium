import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, to } = body;

    // In a real application, you would use an email sending service
    // like Resend, Nodemailer, or SendGrid to send the email.
    // For demonstration purposes, we'll just log the data to the console.
    console.log('Received contact form submission:');
    console.log({ name, email, phone, subject, message, to });

    // Example: await sendEmail({ to, from: 'contact@kidszone.co.ke', subject, html: `...` });

    // Simulate a successful API call
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
