// export const sendOtp = async (userEmail, otp) => {
//   try {
//     const response = await fetch('https://resend-api-online-banking.vercel.app/api/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: userEmail,
//         otp,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Error sending otp email: ${response.statusText}`);
//     }

//     const result = await response.json();
//     console.log('OTP email sent successfully:', result);

//     return result;
//   } catch (error) {
//     console.error('Error sending email:', error.message);
//     throw error; // Re-throw to handle upstream
//   }
// };


// export const sendOtp = async (email) => {
//   try {
//     const response = await fetch(
//       'https://resend-api-online-banking.vercel.app/api/send-otp',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       }
//     );

//     const data = await response.json();
//     console.log('sendOtp response:', data);

//     return data; // ✅ important to return data so caller can use it
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     throw error; // propagate error to caller if needed
//   }
// };




// /lib/sendOtp.js
import emailjs from 'emailjs-com';

// Generate and send OTP via EmailJS
export const sendOtp = async (userEmail) => {
  try {
    // ✅ Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Store OTP temporarily in localStorage (or you can use Supabase if needed)
    localStorage.setItem('pendingOtp', otp);
    localStorage.setItem('otpExpiry', Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // ✅ Send OTP through EmailJS
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,   // your Service ID
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,  // your Template ID
      {
        to_email: userEmail,
        otp_code: otp,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY    // your Public Key
    );

    console.log('EmailJS result:', result.text);

    return { success: true, message: 'OTP sent successfully' };

  } catch (error) {
    console.error('Error sending OTP with EmailJS:', error);
    return { success: false, message: 'Failed to send OTP. Try again.' };
  }
};
