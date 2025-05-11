import { Facebook, Instagram, Linkedin } from "lucide-react";
import { appData } from "@/constants/index";
const { facebookUrl, instagramUrl, linkedinUrl } = appData;

export default function SocialLinks() {
  const iconClasses = "h-6 w-6 text-primary transition-transform hover:scale-110";
  const socialLinks = [
    {
      name: "Facebook",
      url: facebookUrl,
      icon: <Facebook className={iconClasses} />,
    },
    {
      name: "Instagram",
      url: instagramUrl,
      icon: <Instagram className={iconClasses} />,
    },
    {
      name: "LinkedIn",
      url: linkedinUrl,
      icon: <Linkedin className={iconClasses} />,
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <a
          title={link.name}
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
