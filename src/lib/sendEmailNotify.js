export const sendEmailNotification = async (userEmail, trackingId, shipmentDetails) => {
  // Send email using Resend SDK
  try {
    await fetch('https://resend-api-backend-shipwide-das5yo17d.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        trackingId: trackingId,
        shipmentDetails: shipmentDetails
      })
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};