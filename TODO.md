# Todo

> ⚠️ **BELANGRIJK:** Dit bestand heeft een JSON tegenhanger (`TODO.json`). Bij elke wijziging in dit bestand MOET `TODO.json` ook worden bijgewerkt, en vice versa. Dezelfde regel geldt voor `ROADMAP.md` ↔ `ROADMAP.json`. Deze bestanden mogen NOOIT worden verwijderd.

## Huidige Fase: Fase 10 — Responsive Design, Accessibility & Polish ⏳

### Fase 10: Responsive Design, Accessibility & Polish ⏳

**Dark Mode**
- [x] useAppStore uitgebreid met theme state (light/dark/system), localStorage persistence, prefers-color-scheme listener
- [x] CSS dark mode variabelen in index.css (.dark klasse, dark scrollbar, dark body)
- [x] 3-weg theme toggle in Sidebar (Licht/Donker/Systeem met Sun/Moon/Monitor iconen)
- [x] Dark mode op alle layout componenten (Header, Sidebar, MainArea, Dashboard)
- [x] Dark mode op alle entry componenten (EntryModal, EntryForm, EntryTypeSelector, EntryReferences, ReferenceSelector)
- [x] Dark mode op alle search componenten (SearchBar, AdvancedFilters, ActiveFilters, EmptyResults, FilterTag)
- [x] Dark mode op alle dashboard componenten (LatestEntry, StatsPanel, QuickActions, RandomHighlight, Flashbacks, TopTags)
- [x] Dark mode op alle timeline componenten (Timeline, TimelinePin)
- [x] Dark mode op alle view componenten (ListView, ListItem, GridView, GridCard)
- [x] Dark mode op alle tag componenten (TagInput, TagManager, TagSuggestions)
- [x] Dark mode op alle graph componenten (GraphView, GraphNode, GraphControls)
- [x] Dark mode op UI componenten (ToastContainer)

**Responsive Design**
- [x] MobileNav.tsx — sticky bottom navigation bar voor mobile met view toggles en FAB "+" knop
- [x] Header.tsx — hamburger menu op mobile, verborgen elementen op kleine schermen
- [x] Sidebar.tsx — mobile overlay van rechts met backdrop en slide animatie
- [x] MainArea.tsx — flex-col op mobile, flex-row op desktop, mobile bottom padding voor MobileNav
- [x] EntryModal.tsx — full-screen op mobile (h-[95vh], rounded-t-2xl, slide-up), centered op desktop
- [x] App.tsx — MobileNav component toegevoegd

**Accessibility & Performance**
- [x] prefers-reduced-motion: alle animaties uitgeschakeld bij voorkeur
- [x] Touch targets: .touch-target utility (min 44x44px) op interactieve elementen
- [x] ARIA labels op interactieve elementen
- [x] Semantische HTML (<aside> met role="complementary" voor Dashboard)
- [x] SkeletonLoader.tsx — TimelineSkeleton, ListSkeleton, GridSkeleton, DashboardSkeleton met role="status"
- [x] React.lazy voor GraphView met Suspense fallback
- [x] Skeleton loaders bij view loading states

**Nog te doen**
- [ ] Kleurcontrast audit (WCAG 4.5:1)
- [ ] Performance meting (FCP < 2s target)

### Fase 9 afgerond: AI Tag Suggesties ✅

**AI Module & Edge Function**
- [x] tagSuggestions.ts — client-side module met Supabase Edge Function invoke, rate limiting (max 10/min)
- [x] suggest-tags Edge Function — Deno edge function met OpenAI gpt-4o-mini, prompt engineering voor tag suggesties
- [x] AI provider gekozen: OpenAI (gpt-4o-mini via Supabase Edge Function)

**Hook**
- [x] useTagSuggestions.ts — 500ms debounce, min 10 chars, max 5 suggesties, 30s auto-dismiss, loading/error states

**Component**
- [x] TagSuggestions.tsx — subtiele violet pills met Sparkles icoon, klik om toe te voegen, dismiss per suggestie of alles
- [x] Loading state met spinning Loader2 icoon
- [x] Alles negeren knop

**Integratie**
- [x] TagSuggestions geïntegreerd in EntryModal.tsx onder TagInput sectie
- [x] handleAcceptSuggestion: bestaande tag hergebruiken of nieuwe aanmaken + toevoegen
- [x] Werkt voor zowel nieuwe als bestaande entries (pending tags flow)

**Nog te doen: Deployment**
- [ ] OPENAI_API_KEY instellen als Supabase secret: `supabase secrets set OPENAI_API_KEY=sk-...`
- [ ] Edge function deployen: `supabase functions deploy suggest-tags --no-verify-jwt`

### Fase 8 afgerond: Entry Verwijzingen & Graph View ✅

**Entry Verwijzingen**
- [x] ReferenceSelector.tsx — zoek dropdown om entries te vinden en verwijzen
- [x] EntryReferences.tsx — outgoing/incoming refs met add/remove, broken reference handling
- [x] references.ts Supabase queries (CRUD voor entry_references)
- [x] useReferences.ts hooks (useReferences, useAllReferences, useReferencedEntries)
- [x] Integratie in EntryModal.tsx (referenties sectie onder tags)

**Graph View**
- [x] GraphView.tsx — SVG force-directed graph met zoom/pan, hover tooltips
- [x] GraphNode.tsx — type-gekleurde cirkels met hover glow, labels
- [x] GraphControls.tsx — zoom in/out/reset knoppen, stats overlay
- [x] graph.ts queries (buildGraphData met shared-tag edges en reference edges)
- [x] useGraph.ts hook (d3-force simulation: forceSimulation, forceLink, forceManyBody, forceCenter)
- [x] useGraphStore.ts (Zustand store voor zoom/pan state)
- [x] Graph view geïntegreerd in MainArea.tsx (vervangt placeholder)
- [x] d3-force en @types/d3-force dependencies geïnstalleerd

### Fase 7 afgerond: Reflectie & Dashboard Elementen ✅

**Reflectie componenten**
- [x] RandomHighlight.tsx — "Herontdek dit..." met willekeurige oude entry (min. 2 weken oud)
- [x] Flashbacks.tsx — entries van 1, 2, 3, ... maanden geleden (±2 dagen window)
- [x] TopTags.tsx — top 5 meest gebruikte tags met kleur en count
- [x] Refresh knop op random highlight om ander item te tonen

**Queries & Hooks**
- [x] reflections.ts queries (fetchRandomEntry, fetchFlashbackEntries, fetchAllFlashbacks)
- [x] useReflections.ts (useRandomHighlight, useFlashbacks)
- [x] useTopTags.ts — computed uit entryTagsMap via useMemo

**Dashboard integratie**
- [x] Dashboard.tsx uitgebreid met RandomHighlight, Flashbacks, TopTags
- [x] QuickActions.tsx uitgebreid met "Review deze week" actie (set dateRange filter)
- [x] Klik op reflectie-element opent entry modal

### Fase 6 afgerond: Zoeken & Filteren ✅

**Search**
- [x] SearchBar.tsx met debounced input (300ms), / keyboard shortcut, clear button
- [x] Smart search doorzoekt titel, content, status, entry type en tags
- [x] Zoekresultaten updaten real-time terwijl je typt

**Geavanceerde Filters**
- [x] AdvancedFilters.tsx met toggle panel vanuit Header
- [x] Filteren op entry type (multi-select met iconen en kleuren)
- [x] Filteren op tags (multi-select met gekleurde pills)
- [x] Filteren op status (multi-select)
- [x] Filteren op datumbereik (van/tot date inputs)
- [x] Combineren van meerdere filters (AND logica)
- [x] Clear button reset alle filters

**Filter Indicatoren**
- [x] ActiveFilters.tsx toont actieve filter pills met remove buttons
- [x] FilterTag.tsx pill component met kleur en X knop
- [x] Filter count badge op filter toggle button
- [x] EmptyResults.tsx met friendly message en "Filters wissen" knop

**Integratie**
- [x] SearchBar in Header.tsx tussen view toggles en actie knoppen
- [x] AdvancedFilters + ActiveFilters in App.tsx onder Header
- [x] useFilteredEntries hook in App.tsx filtert entries client-side
- [x] Gefilterde entries doorgegeven aan MainArea en alle views
- [x] Filters behouden bij view switch (Zustand store)
- [x] EmptyResults getoond in MainArea wanneer filters geen resultaten opleveren

**Store & Hooks**
- [x] useFilterStore.ts (Zustand) — searchQuery, selectedTags, selectedTypes, selectedStatuses, dateRange
- [x] useSearch.ts — debounced value hook (300ms)
- [x] useFilters.ts — useFilteredEntries hook met compound client-side filtering

### Vorige fase afgerond: Fase 5 — Alternatieve Views (List & Grid) ✅

**List View**
- [x] ListView.tsx met datum-groepering, infinite scroll, empty/loading states
- [x] ListItem.tsx met type icoon, titel, content preview, tags (max 2), status, type label, datum
- [x] Compacte rij-layout, klikbaar naar modal

**Grid View**
- [x] GridView.tsx met responsive CSS Grid (1/2/3 kolommen), infinite scroll, empty/loading states
- [x] GridCard.tsx met kleur accent bar, type icoon + label, titel, content preview (3 regels), tags, status, datum
- [x] hover effect met shadow + lift animatie

**View Switching**
- [x] MainArea.tsx gerefactord: Timeline/ListView/GridView conditioneel gerenderd
- [x] Smooth fade transitie via viewSwitch keyframe (180ms) met key={currentView}
- [x] Graph view placeholder behouden
- [x] URL params werkten al via useAppStore (?view=list, ?view=grid)
- [x] View toggle buttons in Header al functioneel

**CSS**
- [x] viewSwitch keyframe animatie (fade + translateY)
- [x] line-clamp-3 utility toegevoegd

### Vorige fase afgerond: Fase 4 — Tags Systeem ✅

**Tags CRUD & Store**
- [x] colorPalette.ts met 20 kleuren en auto-assignment
- [x] tags.ts Supabase queries (CRUD, link/unlink, batch fetchTagsForEntries)
- [x] useTagStore met entryTagsMap, optimistic updates, batch loading
- [x] useTags.ts hook (useEntryTags, useTags)

**Tag Componenten**
- [x] TagBadge — gekleurde pill met dot + tekst, removable variant
- [x] TagInput — autocomplete dropdown met zoeken, bestaande tags selecteren, inline nieuwe tag aanmaken
- [x] TagManager — tag beheer panel met color picker (20 kleuren) en verwijderen met confirmatie

**Integratie**
- [x] Tags sectie in EntryModal (onder EntryForm, met border separator)
- [x] Pending tags flow voor nieuwe entries (link na save)
- [x] Tag badges op TimelinePin (max 3 + overflow indicator)
- [x] Batch tag loading in App.tsx voor alle zichtbare entries
- [x] Tags + entry tags laden bij app mount
- [x] entryTypes.ts constants (ENTRY_TYPE_ICONS, ENTRY_TYPE_COLORS)

### Vorige fase afgerond: Fase 3 — Timeline View & Homepage Dashboard ✅

**Timeline**
- [x] Timeline.tsx met verticale lijn, datum-groepering (Vandaag/Gisteren/datum), en connector dots
- [x] TimelinePin.tsx met type-icoon, titel, tijdstip, status badge, hover tooltip met content preview
- [x] Infinite scroll via IntersectionObserver sentinel (batches van 50)
- [x] Empty state met Anchor icoon en "Eerste entry" knop
- [x] "Begin van je tijdlijn" indicator onderaan

**Dashboard**
- [x] Dashboard.tsx wrapper met LatestEntry, StatsPanel, QuickActions
- [x] LatestEntry.tsx met type-icoon, kleur border, content preview, time-ago
- [x] StatsPanel.tsx met 4 stat cards (deze maand, deze week, bookmarks, totaal) + iconen
- [x] QuickActions.tsx met "Nieuwe entry" en "Verder met [laatste entry]"

**Store & integratie**
- [x] useEntryStore uitgebreid met isLoadingMore, hasMore, loadMore() (batch pagination met deduplicatie)
- [x] MainArea.tsx gerefactord naar props-based (entries, isLoading, hasMore, onLoadMore)
- [x] App.tsx haalt pagination state uit store, passed naar MainArea
- [x] View placeholders voor list/grid/graph views

### Vorige fase afgerond: Fase 2 — Entry Systeem — Basis CRUD ✅

**Entry CRUD**
- [x] EntryTypeSelector component (6-type grid bij klikken op "Nieuw")
- [x] EntryForm component met type-specifieke velden (titel, content, status, datum)
- [x] EntryModal component (centered, dimmed achtergrond, focus trap, Escape sluiten)
- [x] Supabase CRUD queries (`src/lib/queries/entries.ts`)
- [x] Entry store met optimistic updates (`src/store/useEntryStore.ts`)
- [x] Auto-save hook (3s debounce, `src/hooks/useAutoSave.ts`)
- [x] Toast notificatie systeem (custom, `src/store/useToastStore.ts` + `src/components/ui/ToastContainer.tsx`)
- [x] Entry archiveren en definitief verwijderen
- [x] "Nieuw" knop in Header gekoppeld aan EntryTypeSelector
- [x] MainArea toont entries met type-iconen, kleuren, klikbaar naar modal
- [x] Dashboard sidebar met live stats (deze maand, bookmarks) en laatste entry

### Vorige fase afgerond: Fase 1 — Project Setup & Basisstructuur ✅

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
