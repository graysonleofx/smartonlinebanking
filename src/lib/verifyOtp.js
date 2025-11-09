export const verifyOtp = async (email, otp) => {
  const res = await fetch("https://resend-api-online-banking.vercel.app/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const result = await res.json();
  return result;
};