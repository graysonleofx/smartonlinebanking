export const sendOtp = async (userEmail, otp) => {
  try {
    const response = await fetch('https://resend-api-online-banking.vercel.app/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        otp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error sending otp email: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('OTP email sent successfully:', result);

    return result;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Re-throw to handle upstream
  }
};