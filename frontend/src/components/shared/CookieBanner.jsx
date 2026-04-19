import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { initAnalytics } from '../../lib/analytics';

export const CookieBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I Understand"
      declineButtonText="Opt Out"
      enableDeclineButton
      onAccept={() => {
        initAnalytics(true);
      }}
      onDecline={() => {
        // Analytics library handles ignoring hits when not initialized
        initAnalytics(false);
      }}
      style={{ background: '#0f0f1a', borderTop: '1px solid #1e1e2f', zIndex: 9999, padding: '10px 20px' }}
      buttonStyle={{ background: '#6366f1', color: 'white', fontSize: '14px', borderRadius: '8px', padding: '10px 24px', fontWeight: 'bold' }}
      declineButtonStyle={{ background: 'transparent', color: '#64748b', fontSize: '13px', textDecoration: 'underline' }}
      cookieName="quad_tracking_consent"
    >
      <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>
        <strong>We value your privacy.</strong><br/>
        The Quad uses analytical cookies to understand how students navigate the platform, 
        helping us improve AI-matching algorithms and server response times. 
        <a href="/privacy" style={{ color: '#818cf8', marginLeft: '5px' }}>Read More</a>.
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;
