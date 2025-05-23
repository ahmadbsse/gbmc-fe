import { appData } from "@/constants/index";
import Image from "next/image";
const { facebookUrl, instagramUrl, linkedinUrl } = appData;

export default function SocialLinks() {
  const socialLinks = [
    {
      name: "Facebook",
      url: facebookUrl,
      icon: "/assets/facebook.svg",
    },
    {
      name: "Instagram",
      url: instagramUrl,
      icon: "/assets/instagram.svg",
    },
    {
      name: "LinkedIn",
      url: linkedinUrl,
      icon: "/assets/linkedin.svg",
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
          <Image
            width={24}
            height={24}
            src={link.icon}
            alt={link.name}
            className="h-6 w-6 transition-transform hover:scale-110"
          />
        </a>
      ))}
    </div>
  );
}
