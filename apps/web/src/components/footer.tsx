import Link from 'next/link'

const footerLinks = {
  platform: [
    { href: '/participate', label: 'Participate' },
    { href: '/equip', label: 'Equip' },
    { href: '/runstate', label: 'Measure' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/credits', label: 'Credits' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-light tracking-tight">
              1HP
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              One Human Powered.
              <br />
              Movement, by humans.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-medium mb-3">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Built with care in India.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 1HP
          </p>
        </div>
      </div>
    </footer>
  )
}
