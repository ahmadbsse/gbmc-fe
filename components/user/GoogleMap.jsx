import React from "react";

const GoogleMap = () => {
  return (
    <div className="h-52 w-full rounded-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.4932624402077!2d74.42024197630049!3d31.592941174180837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391910137022ae37%3A0x1bc41a2237f97221!2sGlobal%20Meccanica!5e0!3m2!1sen!2s!4v1739041189178!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
