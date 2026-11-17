import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { HomePage } from './features/home/HomePage.tsx'

// La page de visite du design system n'existe qu'en développement : elle est absente du build de production.
const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import('./features/dev/DesignSystemPage.tsx').then((m) => ({ default: m.DesignSystemPage })))
  : null

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {DesignSystemPage && (
          <Route
            path="/dev/design-system"
            element={
              <Suspense fallback={null}>
                <DesignSystemPage />
              </Suspense>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  )
}
