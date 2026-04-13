import admin from 'firebase-admin';

let initialized = false;

/**
 * Initialize Firebase Admin SDK.
 * Gracefully skips if FIREBASE_SERVICE_ACCOUNT env var is not set.
 */
export const initializeFirebase = () => {
  if (initialized) return;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    console.warn('[firebase]: FIREBASE_SERVICE_ACCOUNT not set — push notifications disabled');
    return;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
    console.log('[firebase]: Firebase Admin SDK initialized');
  } catch (err) {
    console.error('[firebase]: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON', err);
  }
};

/**
 * Send a push notification to a single device token.
 * Returns true on success, false on failure (token removed if invalid).
 */
export const sendPushNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> => {
  if (!initialized) return false;

  try {
    await admin.messaging().send({
      token: deviceToken,
      notification: { title, body },
      data: data ?? {},
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
    });
    return true;
  } catch (error: any) {
    // Token invalid/unregistered — signal caller to remove it
    if (
      error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered'
    ) {
      console.warn(`[firebase]: Stale device token removed: ${deviceToken.substring(0, 20)}...`);
      return false; // caller handles removal
    }
    console.error('[firebase]: Push notification failed:', error.message);
    return false;
  }
};

/**
 * Send push notifications to multiple device tokens in a batch.
 * Returns the list of stale tokens that should be removed from the DB.
 */
export const sendBatchPushNotifications = async (
  deviceTokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<string[]> => {
  if (!initialized || deviceTokens.length === 0) return [];

  const staleTokens: string[] = [];

  const results = await Promise.allSettled(
    deviceTokens.map((token) => sendPushNotification(token, title, body, data))
  );

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled' && result.value === false) {
      staleTokens.push(deviceTokens[idx]);
    }
  });

  return staleTokens;
};
