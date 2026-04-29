import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import { getCategoryColor } from '@/lib/utils'
import type { Category } from '@/types'

const previewPicks: { category: Category; title: string; source: string }[] = [
  { category: 'Read', title: 'Situational Awareness', source: 'Leopold Aschenbrenner' },
  { category: 'Watch', title: 'Sinners', source: 'Ryan Coogler / A24' },
  { category: 'Listen', title: 'Manning Fireworks', source: 'MJ Lenderman' },
]

export function ProductPreview() {
  return (
    <div
      className="mx-auto w-full max-w-sm overflow-hidden rounded-[10px]"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))',
        border: '1px solid rgba(255,255,255,0.075)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Mock status bar */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="font-mono-orbit text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.24)' }}>
          Week of Apr 14
        </span>
        <span
          className="font-mono-orbit px-2 py-0.5 text-[9px] uppercase tracking-[0.12em]"
          style={{
            background: 'rgba(200,168,130,0.12)',
            color: '#C8A882',
            border: '1px solid rgba(200,168,130,0.2)',
          }}
        >
          5 items
        </span>
      </div>

      {/* Items preview */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {previewPicks.map((pick, i) => {
          const color = getCategoryColor(pick.category)
          return (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px]"
                style={{ background: `${color}12`, color }}
              >
                <CategoryGlyph category={pick.category} size={14} />
              </span>
              <div className="min-w-0">
                <p
                  className="truncate font-serif-orbit text-[17px] leading-tight"
                  style={{ color: '#F0EBE1' }}
                >
                  {pick.title}
                </p>
                <p className="truncate font-serif-orbit text-[13px] italic" style={{ color: 'rgba(240,235,225,0.38)' }}>
                  {pick.source}
                </p>
              </div>
              <span
                className="font-mono-orbit ml-auto flex-shrink-0 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em]"
                style={{ background: `${color}12`, color }}
              >
                {pick.category}
              </span>
            </div>
          )
        })}

        {/* More indicator */}
        <div className="flex items-center gap-2 px-5 py-3">
          <div className="flex gap-1">
            {['#FFD07B', '#7BFFB3'].map((c, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-[5px]"
                style={{ background: `${c}15` }}
              />
            ))}
          </div>
          <span className="font-mono-orbit text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            + 2 more
          </span>
        </div>
      </div>
    </div>
  )
}
