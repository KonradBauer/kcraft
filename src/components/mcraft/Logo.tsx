import Link from 'next/link'

interface LogoProps {
  strokeColor?: string
  size?: number
}

export function Logo({ strokeColor = '#fff', size = 38 }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-[14px]">
      <svg
        viewBox="0 0 60 60"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <path d="M14 8v44M14 30L47 8M14 30L47 52" />
      </svg>
      <span className="font-montserrat font-semibold text-[20px] tracking-[0.34em]">KCRAFT</span>
    </Link>
  )
}
