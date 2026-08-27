import { Link2 } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaBehance,
  FaDev,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaReddit,
  FaStackOverflow,
  FaTelegram,
  FaThreads,
  FaTwitch,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const platformIconMap: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  x: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  behance: FaBehance,
  medium: FaMedium,
  devto: FaDev,
  "dev.to": FaDev,
  stackoverflow: FaStackOverflow,
  reddit: FaReddit,
  discord: FaDiscord,
  telegram: FaTelegram,
  twitch: FaTwitch,
  threads: FaThreads,
};

function normalize(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9.]/gi, "");
}

interface SocialIconProps {
  platform: string;
  size?: number;
  className?: string;
}

const SocialIcon = ({ platform, size = 18, className }: SocialIconProps) => {
  const Icon = platformIconMap[normalize(platform)];

  if (!Icon) {
    return <Link2 size={size} className={className} strokeWidth={1.8} />;
  }

  return <Icon size={size} className={className} />;
};

export default SocialIcon;