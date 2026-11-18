import { NavLink } from 'react-router'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import styles from './TabBar.module.css'

const ICON_PROPS = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

const TABS = [
  {
    to: paths.home(),
    end: true,
    label: fr.tabs.games,
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    to: paths.history(),
    end: false,
    label: fr.tabs.scores,
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    to: paths.settings(),
    end: false,
    label: fr.tabs.settings,
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="2.5" />
        <circle cx="15" cy="17" r="2.5" />
      </svg>
    ),
  },
]

/** Barre d'onglets du bas, sur les trois écrans racines : Jeux, Scores, Réglages. */
export function TabBar() {
  return (
    <nav className={styles.bar} aria-label={fr.tabs.label}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          {tab.icon}
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
