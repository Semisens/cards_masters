import { BrowserRouter } from 'react-router'
import { AppRoutes } from './AppRoutes.tsx'
import { ModeProvider } from './state/ModeProvider.tsx'

export function App() {
  return (
    <ModeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ModeProvider>
  )
}
