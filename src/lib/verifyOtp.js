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


export const verifyOtp = async (email, otp) => {
  const res = await fetch("https://resend-api-online-banking.vercel.app/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    throw new Error(`Error verifying otp: ${res.statusText}`);
  }

  const result = await res.json();
  console.log('OTP verified successfully:', result);

  return result;
};
