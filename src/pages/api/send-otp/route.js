import { NextResponse } from 'next/server';
// Import the Resend SDK
import {Resend} from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };    

  // Send the email using Resend
  try {
    const body = await req.json();
    // Destructure the necessary fields from the request body
    const { email, otp } = body;
    const data = await resend.emails.send({
      from: 'no-reply@federaledgefinance.com',
      to: email,
      subject: `Your OTP Code: ${ otp }`,
      html: `
        <div style="background:#f6f6f6;padding:0;margin:0; width:100%; font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:0;margin:0;">
        <tr>
          <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin:40px 0;">
            <tr>
            <td style="padding:32px 32px 16px 32px;text-align:center;">
              <!-- Logo Placeholder -->
              <img src="https://via.placeholder.com/120x40?text=Logo" alt="Federal Edge Finance" style="display:block;margin:0 auto 16px auto;max-width:120px;">
              <h2 style="font-family:Arial,sans-serif;color:#222;font-size:24px;margin:0 0 8px 0;">Federal Edge Finance</h2>
              <p style="font-family:Arial,sans-serif;color:#555;font-size:16px;margin:0 0 24px 0;">Your OTP Code is:</p>
              <div style="font-family:Arial,sans-serif;color:#222;font-size:32px;font-weight:bold;margin:16px 0;padding:12px 0;border:2px dashed #F97316;display:inline-block;width:120px;text-align:center;letter-spacing:4px;">
                ${otp}
              </div>
            </td>
            </tr>
            <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <p style="font-family:Arial,sans-serif;color:#aaa;font-size:12px;margin:24px 0 0 0;">&copy; ${new Date().getFullYear()} Federal Edge Finance. All rights reserved.</p>
            </td>
            </tr>
          </table>
          </td>
        </tr>
        </table>
      </div>
      `,
    });
    return new Response(JSON.stringify({ success: true, data, message: 'Email sent successfully' }), { headers });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error sending email', error }), { status: 500, headers });
  } 
}
