import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919043140047?text=Hi..%20I%20would%20like%20to%20make%20an%20enquiry.%20My%20name%20is%20"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-[#fff]" />
    </a>
  );
};

export default WhatsAppButton;
