import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/7990806243?text=Hello%20Satvikana!%20I%20would%20like%20to%20order%20makhana." 
      target="_blank" 
      rel="noreferrer"
      className="whatsapp-btn"
      title="Order or Inquire via WhatsApp"
    >
      <MessageCircle size={35} />
    </a>
  );
};

export default WhatsAppButton;
