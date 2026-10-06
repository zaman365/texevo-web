import type { CSSProperties } from 'react'
const paths: Record<string, string> = {
  supply: 'M9 4 4 7 1 13l5 3 2-4v14h16V12l2 4 5-3-3-6-5-3c-1 5-9 5-10 0ZM11 5c1 4 9 4 10 0',
  development: 'M6 3h14l6 6v20H6V3Zm14 0v7h6M10 15h10M10 20h8M10 25h5',
  finishing: 'M8 4v24M24 4v24M4 8h24M4 24h24M13 11l7 5-7 5V11Z',
  office: 'M16 4v8M6 21v-5h20v5M12 4h8v6h-8V4ZM2 22h8v7H2v-7Zm10 0h8v7h-8v-7Zm10 0h8v7h-8v-7Z',
  management: 'M7 4v4M25 4v4M4 7h24v22H4V7Zm0 7h24M9 19h5M18 19h5M9 24h5',
  quality: 'M21 21l8 8M24 14a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM9 14l3 3 6-6',
  logistics: 'm3 9 13-6 13 6v15l-13 6-13-6V9Zm0 0 13 6 13-6M16 15v15M9 6l13 6',
}
export function TextileIcon({ kind, style }: { kind: string; style?: CSSProperties }) {
  return (
    <svg
      className="textile-icon"
      viewBox="0 0 32 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[kind] || paths.supply} />
    </svg>
  )
}
