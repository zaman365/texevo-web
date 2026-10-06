import Link from 'next/link'
import type { ContentRecord } from '@/content/types'
import { contentPath } from '@/content/types'
export function ContentCard({ record, number }: { record: ContentRecord; number?: number }) {
  return (
    <article className={`content-card ${record.kind === 'product' ? 'product-card' : ''}`}>
      <div className="card-meta">
        <span>{record.eyebrow}</span>
        {number && <span className="index-number">{String(number).padStart(2, '0')}</span>}
      </div>
      <h3>
        <Link href={contentPath(record)}>{record.title}</Link>
      </h3>
      <p>{record.description}</p>
      <span className="card-tail">
        {record.kind === 'product'
          ? 'Planungsprofil ansehen'
          : record.locale === 'en'
            ? 'Read more'
            : 'Weiterlesen'}{' '}
        <span aria-hidden="true">↗</span>
      </span>
    </article>
  )
}
