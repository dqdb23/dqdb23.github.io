import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Only Falware',
  description:
    'Malware Analyst | Cyber Threat Hunter',
  href: 'https://dqdb23.github.io',
  author: 'sonz',
  locale: 'vie',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/authors',
    label: 'authors',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/dqdb23',
    label: 'GitHub',
  },
  {
    href: 'https://github.com/dqdb23',
    label: 'Twitter',
  },
  {
    href: 'mailto:vtrsonnnnnnn@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
