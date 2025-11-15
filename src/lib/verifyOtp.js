// export const verifyOtp = async (email, otp) => {
//   // try {
//   const res = await fetch("https://resend-api-online-banking.vercel.app/api/verify-otp", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, otp }),
//   });
//   if (!res.ok) {
//     throw new Error(`Error verifying otp: ${res.statusText}`);
//   }

//   const result = await res.json();
//   console.log('OTP verified successfully:', result);
//   return result;
//   // } catch (error) {
//   //   console.error('Error verifying OTP:', error.message);
//   //   throw error; // Re-throw to handle upstream
//   // }
// };


// export const verifyOtp = async (email, otp) => {
//   const res = await fetch("https://resend-api-online-banking.vercel.app/api/verify-otp", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, otp }),
//   });

//   if (!res.ok) {
//     throw new Error(`Error verifying otp: ${res.statusText}`);
//   }

//   const result = await res.json();
//   console.log('OTP verified successfully:', result);

//   return result;
// };


// ...existing code...
// export const verifyOtp = async (email, otp) => {
//   try {
//     // include both keys and numeric form to match backend expectations
//     const payload = {
//       email,
//       otp,              // string form
//       code: otp,        // some backends expect "code"
//       otp_numeric: Number(otp) || undefined // optional numeric field
//     };
//     console.log('verifyOtp - sending payload:', payload);

//     const res = await fetch("https://resend-api-online-banking.vercel.app/api/verify-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Accept: "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const body = await res.json().catch(() => null);
//     console.log('verifyOtp - response status:', res.status, 'body:', body);

//     if (!res.ok) {
//       const msg = body?.message || body?.error || JSON.stringify(body) || res.statusText;
//       throw new Error(msg);
//     }

//     return body;
//   } catch (err) {
//     console.error('verifyOtp error:', err);
//     throw err;
//   }
// };
// ...existing code...


// export const verifyOtp = async (email, otp) => {
//   try {
//     const response = await fetch(
//       'https://resend-api-online-banking.vercel.app/api/verify-otp',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       }
//     );
//     const data = await response.json();
//     console.log('verifyOtp response:', data);
//     return data; // ✅ must return
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     throw error;
//   }
// };


// /lib/verifyOtp.js

export const verifyOtp = async (email, enteredOtp) => {
  try {
    const savedOtp = localStorage.getItem('pendingOtp');
    const expiry = localStorage.getItem('otpExpiry');

    if (!savedOtp) {
      return { success: false, message: 'No OTP found. Please request again.' };
    }

    // ✅ Check expiry
    if (Date.now() > expiry) {
      localStorage.removeItem('pendingOtp');
      localStorage.removeItem('otpExpiry');
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    // ✅ Compare
    if (enteredOtp === savedOtp) {
      // Clear OTP from local storage after success
      localStorage.removeItem('pendingOtp');
      localStorage.removeItem('otpExpiry');

      return { success: true, message: 'OTP verified successfully.' };
    }

    return { success: false, message: 'Invalid OTP. Please try again.' };
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { success: false, message: 'Something went wrong verifying OTP.' };
  }
};

