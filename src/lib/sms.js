/**
 * Mock SMS Provider
 * In a real application, you would integrate Twilio, AWS SNS, MSG91, etc. here.
 */

export async function sendSMSNotification(phone, message) {
  if (!phone) {
    console.log('[SMS Provider] ❌ Failed: No phone number provided.');
    return false;
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('\n=============================================');
  console.log(`📱 [MOCK SMS] Outgoing Message to: ${phone}`);
  console.log('---------------------------------------------');
  console.log(`${message}`);
  console.log('=============================================\n');

  return true;
}
