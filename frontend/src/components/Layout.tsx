import { Outlet, NavLink } from 'react-router-dom'
import { Sparkles, Calendar, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillTransfer</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/services"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <LayoutGrid className="h-4 w-4" />
              Services
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Calendar className="h-4 w-4" />
              My Bookings
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
