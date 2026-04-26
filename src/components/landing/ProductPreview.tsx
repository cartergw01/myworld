import { getCategoryColor, getCategoryIcon } from '@/lib/utils'
import type { Category } from '@/types'

const previewPicks: { category: Category; title: string; source: string }[] = [
  { category: 'Read', title: 'Situational Awareness', source: 'Leopold Aschenbrenner' },
  { category: 'Watch', title: 'Sinners', source: 'Ryan Coogler / A24' },
  { category: 'Listen', title: 'Manning Fireworks', source: 'MJ Lenderman' },
]

export function ProductPreview() {
  return (
    <div
      className="rounded-3xl overflow-hidden mx-auto w-full max-w-sm"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Mock status bar */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-xs font-medium" style={{ color: '#5A5A5A' }}>
          Week of Apr 14
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(200,168,130,0.12)',
            color: '#C8A882',
            border: '1px solid rgba(200,168,130,0.2)',
          }}
        >
          5 picks
        </span>
      </div>

      {/* Picks preview */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {previewPicks.map((pick, i) => {
          const color = getCategoryColor(pick.category)
          const icon = getCategoryIcon(pick.category)
          return (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${color}12` }}
              >
                {icon}
              </span>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: '#F0EBE1' }}
                >
                  {pick.title}
                </p>
                <p className="text-xs truncate" style={{ color: '#5A5A5A' }}>
                  {pick.source}
                </p>
              </div>
              <span
                className="text-xs ml-auto flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: `${color}12`, color }}
              >
                {pick.category}
              </span>
            </div>
          )
        })}

        {/* More indicator */}
        <div className="px-5 py-3 flex items-center gap-2">
          <div className="flex gap-1">
            {['#FFD07B', '#7BFFB3'].map((c, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-lg"
                style={{ background: `${c}15` }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: '#3A3A3A' }}>
            + 2 more picks
          </span>
        </div>
      </div>
    </div>
  )
}
