import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'Find Tutors', href: '#' },
    { name: 'Become a Tutor', href: '#' },
    { name: 'How it Works', href: '#' },
    { name: 'Pricing', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

const socialLinks = [
  { icon: <Facebook className="h-5 w-5" />, href: '#' },
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  { icon: <Instagram className="h-5 w-5" />, href: '#' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 relative overflow-hidden pt-20">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Spacer for the image */}
          <div className="hidden md:block"></div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Platform</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Grammerwise. All rights reserved.</p>
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">{link.icon}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-0">
        <Image src="/images/blue-flowers.jpg" alt="" width={250} height={160} className="opacity-70" />
      </div>
    </footer>
  );
};

export default Footer;