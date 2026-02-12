# Todo

> ⚠️ **BELANGRIJK:** Dit bestand heeft een JSON tegenhanger (`TODO.json`). Bij elke wijziging in dit bestand MOET `TODO.json` ook worden bijgewerkt, en vice versa. Dezelfde regel geldt voor `ROADMAP.md` ↔ `ROADMAP.json`. Deze bestanden mogen NOOIT worden verwijderd.

## Huidige Fase: Fase 1 — Project Setup & Basisstructuur

### Actieve taken

**Project initialisatie**
- [x] Maak Vite + React + TypeScript project aan (`npm create vite@latest`)
- [x] Installeer dependencies: `tailwindcss`, `@supabase/supabase-js`, `zustand`, `lucide-react`
- [x] Configureer Tailwind CSS met PostCSS en Autoprefixer
- [x] Stel `tsconfig.json` in met path aliases (`@/` → `src/`)

**Design tokens & styling**
- [x] Definieer kleurenpalet in `tailwind.config.ts` (primary, secondary, neutral, semantic)
- [x] Definieer typografie scale (base 16px, headings, small text)
- [x] Definieer spacing scale en border radius waarden
- [x] Stel basis `index.css` in met global styles en font imports

**Database**
- [x] Maak Supabase project aan (of gebruik bestaand)
- [x] Schrijf migration: `entries` tabel (id, title, content, entry_type, status, custom_date, image_url, created_at, updated_at, archived)
- [x] Schrijf migration: `tags` tabel (id, name, color, created_at)
- [x] Schrijf migration: `entry_tags` junction tabel (entry_id, tag_id)
- [x] Schrijf migration: `entry_references` tabel (id, from_entry_id, to_entry_id, created_at)
- [ ] Voer migrations uit in Supabase
- [x] Maak `src/lib/supabase.ts` aan met client initialisatie

**TypeScript types**
- [x] Definieer `Entry` interface in `src/types/index.ts`
- [x] Definieer `Tag` interface
- [x] Definieer `EntryType` enum (lesson, idea, milestone, note, resource, bookmark)
- [x] Definieer `ViewType` enum (timeline, list, grid, graph)

**Layout componenten**
- [x] ~~🛑 WACHT OP INPUT: Kies basiscomponent stijl voor sidebar (21st.dev of custom)~~ → Custom gekozen
- [x] Bouw `src/components/layout/Header.tsx` met view toggle buttons (placeholder) en "New entry" button (placeholder)
- [x] Bouw `src/components/layout/Sidebar.tsx` met inklapbare navigatie
- [x] Bouw `src/components/layout/MainArea.tsx` met twee-koloms layout (tijdlijn links, dashboard rechts)
- [x] Stel `src/App.tsx` in als container voor de layout

**State & routing**
- [x] Maak `src/store/useAppStore.ts` aan met Zustand (currentView, sidebarOpen, selectedEntryId)
- [x] Implementeer URL query params lezen/schrijven (?view=, ?entry=)
- [x] Sync URL params met Zustand store

**Environment**
- [x] Maak `.env.local` aan met `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`
- [x] Voeg `.env.local` toe aan `.gitignore`
- [x] Maak `.env.example` aan als template

### Parking Lot

Ideeën en taken voor latere fases:

- Bookmark entries converteren naar andere entry types (fase 2)
- Afbeelding upload bij entries (na fase 2, mogelijk als sub-taak)
- Custom datum instellen bij entries (fase 2)
- Keyboard shortcut `Cmd/Ctrl + B` voor sidebar toggle (fase 10)
- Keyboard shortcut `/` voor zoeken (fase 6)
- localStorage voor sidebar collapsed state (fase 1 of 2)
- Supabase Auth voorbereiden voor toekomstige multi-user support
- Prefers-color-scheme detectie voor dark mode (fase 10)
- Custom font kiezen (system fonts als fallback)
- Deployment setup op Vercel of Netlify (na fase 10)
