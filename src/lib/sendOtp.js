export const sendOtp = async (userEmail, otp) => {
  // Send email using Resend SDK
  try {
    await fetch('https://resend-api-online-banking.vercel.app/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        otp: otp
      })
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};