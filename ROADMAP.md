# Roadmap

## Project: Anchor — Persoonlijk Leer- en Ideeënplatform

> ⚠️ **BELANGRIJK:** Dit bestand heeft een JSON tegenhanger (`ROADMAP.json`). Bij elke wijziging in dit bestand MOET `ROADMAP.json` ook worden bijgewerkt, en vice versa. Dezelfde regel geldt voor `TODO.md` ↔ `TODO.json`. Deze bestanden mogen NOOIT worden verwijderd.

**Status:** In ontwikkeling
**Huidige fase:** ✅ Fase 4: Tags Systeem

## Overzicht Fases

| # | Fase | Status |
|---|---|---|
| 1 | Project Setup & Basisstructuur | ✅ Done |
| 2 | Entry Systeem — Basis CRUD | ✅ Done |
| 3 | Timeline View & Homepage Dashboard | ✅ Done |
| 4 | Tags Systeem | ✅ Done |
| 5 | Alternatieve Views (List & Grid) | ⏳ Todo |
| 6 | Zoeken & Filteren | ⏳ Todo |
| 7 | Reflectie & Dashboard Elementen | ⏳ Todo |
| 8 | Entry Verwijzingen & Graph View | ⏳ Todo |
| 9 | AI Tag Suggesties | ⏳ Todo |
| 10 | Responsive Design, Accessibility & Polish | ⏳ Todo |

## Fase 1: Project Setup & Basisstructuur

### Doel
Een werkend project met basisstructuur, database, en lege layout die in de browser draait.

### Scope
- Vite + React + TypeScript project initialiseren
- Tailwind CSS configureren met basis design tokens (kleuren, typografie, spacing)
- Supabase project aanmaken en database schema opzetten (entries, tags, entry_tags, entry_references tabellen)
- Basis layout structuur bouwen: header, main area (links tijdlijn placeholder, rechts dashboard placeholder), rechter sidebar
- SPA routing opzetten met URL query params (?view=, ?entry=)
- Zustand store initialiseren voor global state
- "New entry" button als placeholder (nog niet functioneel)
- View toggle buttons als placeholder (lijn | lijst | grid | graph iconen)
- Sidebar met basis navigatie (inklapbaar)
- Environment variables setup (.env voor Supabase keys)

### Technische details
- **Bestanden aangemaakt:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- **Layout componenten:** `src/components/layout/Sidebar.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/MainArea.tsx`
- **Store:** `src/store/useAppStore.ts` (Zustand)
- **Supabase:** `src/lib/supabase.ts` (client init), `supabase/migrations/001_initial_schema.sql`
- **Types:** `src/types/index.ts` (Entry, Tag, EntryType, etc.)
- **Dependencies:** `react`, `react-dom`, `tailwindcss`, `@supabase/supabase-js`, `zustand`, `lucide-react` (iconen)
- **Dev dependencies:** `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `autoprefixer`, `postcss`

### Definition of Done
- [x] Project start met `npm run dev` zonder errors
- [x] Tailwind CSS werkt en basis design tokens zijn geconfigureerd
- [x] Supabase database schema is aangemaakt (entries, tags, entry_tags, entry_references)
- [x] Layout is zichtbaar in browser: header, main area met twee kolommen, sidebar rechts
- [x] Sidebar is inklapbaar via toggle button
- [x] View toggle buttons zijn zichtbaar (nog niet functioneel)
- [x] "New entry" button is zichtbaar (nog niet functioneel)
- [x] URL query params worden gelezen en opgeslagen in state (?view=timeline als default)
- [x] TypeScript types voor Entry, Tag, EntryType zijn gedefinieerd
- [x] Environment variables voor Supabase zijn geconfigureerd

### Niet in scope
- Entry creatie of bewerking
- Data ophalen uit database
- Functionele views (timeline, list, grid, graph)
- Tags functionaliteit
- Zoeken en filteren
- AI integratie

## Fase 2: Entry Systeem — Basis CRUD

### Doel
Entries kunnen aanmaken, bekijken, bewerken, archiveren en verwijderen via een centered modal.

### Scope
- "New entry" knop functioneel maken
- Entry type selectie bij aanmaken (lesson, idea, milestone, note, resource, bookmark)
- Formulier per entry type met juiste suggestie-velden
- Entry opslaan naar Supabase
- Entry modal: centered, dimmed/blurry achtergrond, alle velden zichtbaar en direct bewerkbaar
- Inline editing in modal (klik in veld, type, klaar)
- Entry archiveren (verdwijnt uit views, blijft in systeem)
- Entry definitief verwijderen
- Optimistic updates bij opslaan
- Auto-save draft na 3 seconden inactiviteit
- Toast notifications bij save/error
- ✅ Custom UI componenten gekozen (geen externe library)

### Technische details
- **Bestanden aangemaakt:** `src/components/entry/EntryModal.tsx`, `src/components/entry/EntryForm.tsx`, `src/components/entry/EntryTypeSelector.tsx`
- **Store uitbreiding:** `src/store/useEntryStore.ts` (entries state, CRUD actions met optimistic updates)
- **Toast store:** `src/store/useToastStore.ts` (custom toast systeem)
- **Supabase queries:** `src/lib/queries/entries.ts` (create, read, update, archive, unarchive, delete)
- **Hooks:** `src/hooks/useAutoSave.ts` (3s debounced auto-save)
- **UI componenten:** `src/components/ui/ToastContainer.tsx` (custom toast notifications)
- **Types uitbreiding:** NewEntry, EntryUpdate, EntryTypeConfig, ENTRY_TYPE_CONFIGS, Toast types in `src/types/index.ts`
- **CSS animaties:** scaleIn, fadeIn, slideInUp keyframes in `src/index.css`
- Modal met focus trap, Escape sluiten, backdrop click met unsaved changes confirmatie
- Optimistic updates met rollback bij errors

### Definition of Done
- [x] "New entry" knop opent type selectie
- [x] Elk entry type toont de juiste suggestie-velden
- [x] Entry wordt succesvol opgeslagen in Supabase
- [x] Klikken op een entry opent de centered modal met dimmed achtergrond
- [x] Alle velden zijn direct bewerkbaar in de modal
- [x] Auto-save werkt na 3 seconden inactiviteit
- [x] Entry kan worden gearchiveerd (verdwijnt uit view)
- [x] Entry kan definitief worden verwijderd
- [x] Toast notification verschijnt bij opslaan/error
- [x] Modal sluit met Escape, backdrop click (met confirmation bij unsaved changes)
- [x] Focus trap werkt binnen modal
- [x] Optimistic updates zorgen voor snelle UI feedback

### Niet in scope
- Tags toevoegen aan entries
- Timeline weergave
- Zoeken en filteren
- Entry verwijzingen naar andere entries
- AI suggesties
- Afbeeldingen uploaden

## Fase 3: Timeline View & Homepage Dashboard

### Doel
De homepage met verticale tijdlijn links en dashboard rechts, met werkende navigatie door entries.

### Scope
- Verticale tijdlijn implementeren met pinpoints per entry
- Pinpoint toont: icoon voor entry type + titel
- Hover op pinpoint toont extra metadata (datum, tags placeholder, status)
- Klik op pinpoint opent entry modal (uit fase 2)
- Dashboard rechts: laatste entry prominent weergeven
- Stats sectie: entries deze maand, deze week, bookmarks, totaal
- Quick actions: "Nieuwe entry" knop, "Verder met [laatste entry]" shortcut
- Entries laden uit Supabase in batches (50 per keer)
- Infinite scroll via IntersectionObserver
- Datum-groepering (Vandaag, Gisteren, datum)
- ✅ Custom UI componenten gekozen (geen externe library)

### Technische details
- **Timeline:** `src/components/timeline/Timeline.tsx` (datum-groepen, verticale lijn, infinite scroll sentinel, empty/loading states)
- **TimelinePin:** `src/components/timeline/TimelinePin.tsx` (type icoon, titel, tijdstip, status badge, hover tooltip met content preview)
- **Dashboard:** `src/components/dashboard/Dashboard.tsx` (wrapper), `LatestEntry.tsx` (met time-ago), `StatsPanel.tsx` (4 stat cards met iconen), `QuickActions.tsx` (nieuw + doorgaan met laatste)
- **Store uitbreiding:** `isLoadingMore`, `hasMore`, `loadMore()` in `useEntryStore.ts` (batch pagination met deduplicatie)
- **Hook:** `src/hooks/useInfiniteEntries.ts` (standalone hook, ook beschikbaar maar store is primary)
- **MainArea refactor:** Props-based (entries, isLoading, hasMore, onLoadMore), rendert Timeline of view placeholder afhankelijk van currentView
- **App.tsx:** Haalt pagination state uit store, passed als props naar MainArea
- Geen externe dependencies toegevoegd — IntersectionObserver i.p.v. @tanstack/react-virtual

### Definition of Done
- [x] Verticale tijdlijn is zichtbaar aan linkerkant met pinpoints
- [x] Elk pinpoint toont icoon + titel van de entry
- [x] Hover op pinpoint toont extra metadata
- [x] Klik op pinpoint opent entry modal
- [x] Dashboard rechts toont de laatste entry
- [x] Stats tonen: entries deze maand, deze week, bookmarks, totaal
- [x] Quick actions zijn zichtbaar en functioneel
- [x] Entries laden in batches van 50 met infinite scroll
- [x] Tijdlijn scrollt smooth
- [x] Homepage voelt als "Welkom terug. Dit is waar je was gebleven."

### Niet in scope
- List view, grid view, graph view
- Geavanceerd filteren en zoeken
- Tags met kleuren
- Reflectie-elementen (random highlight, flashbacks)
- Responsive mobile layout

## Fase 4: Tags Systeem

### Doel
Volledig werkend tag systeem met kleuren, toewijzing aan entries, en visuele weergave.

### Scope
- Tags aanmaken (handmatig in entry modal via autocomplete input)
- Automatische kleur toewijzing uit palet van 20 kleuren bij nieuwe tag
- Tags koppelen aan entries (entry_tags junction table)
- Tags weergeven op entries in tijdlijn (max 3 + overflow indicator) en modal
- Tags verwijderen van entries (removable badges)
- Tag kleuren handmatig aanpassen (color picker in TagManager)
- Entry type icoon-kleuren gedefinieerd in `src/constants/entryTypes.ts`
- Tags in pinpoints op tijdlijn als gekleurde badges met dot + tekst
- Bestaande tags als autocomplete suggesties bij het typen
- Nieuwe tags aanmaken inline vanuit de autocomplete dropdown
- Tags beheren panel (TagManager) met kleur wijzigen en verwijderen
- Batch laden van tags voor alle zichtbare entries
- Pending tags flow voor nieuwe entries (link na save)

### Technische details
- **Tag componenten:** `src/components/tags/TagBadge.tsx` (gekleurde pill met dot), `TagInput.tsx` (autocomplete + create), `TagManager.tsx` (beheer met kleur picker)
- **Store:** `src/store/useTagStore.ts` (Zustand, entryTagsMap, optimistic updates, batch loading)
- **Supabase queries:** `src/lib/queries/tags.ts` (CRUD, link/unlink, fetchTagsForEntries batch)
- **Hooks:** `src/hooks/useTags.ts` (useEntryTags, useTags convenience hooks)
- **Utils:** `src/utils/colorPalette.ts` (20 kleuren, getNextTagColor, getTagBgColor, getTagBorderColor)
- **Constanten:** `src/constants/entryTypes.ts` (ENTRY_TYPE_ICONS, ENTRY_TYPE_COLORS per type)
- **Integratie:** EntryModal uitgebreid met Tags sectie + pending tags voor new entries, TimelinePin toont tag badges, App.tsx laadt tags + batch entry tags
- Geen externe dependencies toegevoegd

### Definition of Done
- [x] Tags kunnen worden aangemaakt vanuit entry modal
- [x] Nieuwe tags krijgen automatisch een kleur uit het palet
- [x] Tags worden gekoppeld aan entries in de database
- [x] Tags zijn zichtbaar op entries in tijdlijn en modal
- [x] Bestaande tags verschijnen als autocomplete suggesties
- [x] Tags kunnen worden verwijderd van entries
- [x] Tag kleuren zijn handmatig aanpasbaar
- [x] Elk entry type heeft een eigen icoon-kleur
- [x] Tags zijn visueel herkenbaar (kleur + tekst, niet alleen kleur)

### Niet in scope
- AI tag suggesties
- Tag-gebaseerde filtering
- Graph view connecties op basis van tags
- Tag statistieken op dashboard

## Fase 5: Alternatieve Views (List & Grid)

### Doel
Twee extra weergave-opties naast timeline: list view en card grid, met werkende view switching.

### Scope
- List view: compacte lijst, entries onder elkaar, minder detail, klik voor modal
- Card grid: entries als kaartjes naast elkaar, visueel rich
- View toggle buttons functioneel maken (lijn | lijst | grid | graph-placeholder)
- Smooth transitie bij view switch (fade out/in)
- URL params updaten bij switch (?view=list, ?view=grid)
- Filters en zoekstatus behouden bij view switch
- Grid: responsive kolommen (1 op mobile, 2 op tablet, 3+ op desktop)
- Tags zichtbaar in list en grid views
- Entry type iconen in list en grid views
- 🛑 **WACHT OP INPUT:** Kies UI componenten voor list items en grid cards

### Technische details
- **Bestanden aangemaakt:** `src/components/views/ListView.tsx`, `src/components/views/ListItem.tsx`, `src/components/views/GridView.tsx`, `src/components/views/GridCard.tsx`, `src/components/views/ViewSwitcher.tsx`
- **Store uitbreiding:** current view in state, persisteer in URL
- **Hooks:** `src/hooks/useView.ts` (view switching logic)
- CSS Grid voor card grid layout
- Transition animations (150-200ms fade)

### Definition of Done
- [ ] List view toont entries in compacte lijst
- [ ] Grid view toont entries als kaartjes in responsive grid
- [ ] Toggle buttons switchen correct tussen timeline, list en grid
- [ ] URL update bij view switch (?view=timeline/list/grid)
- [ ] Transitie tussen views is smooth (fade)
- [ ] Klik op entry in list/grid opent entry modal
- [ ] Tags en entry type iconen zijn zichtbaar in alle views
- [ ] View keuze blijft behouden bij page refresh (via URL)

### Niet in scope
- Graph view (eigen fase)
- Zoeken en filteren
- Responsive mobile-specifieke layout
- Drag & drop reordering

## Fase 6: Zoeken & Filteren

### Doel
Entries snel vinden via smart search en geavanceerde filters.

### Scope
- Smart search bar: typ tag, datum, of woord → automatisch filteren
- Real-time filtering terwijl je typt (debounce 300ms)
- Geavanceerde filters panel:
  - Meerdere tags tegelijk selecteren
  - Datumbereik instellen
  - Entry type kiezen (multi-select)
  - Status filteren
  - Combinaties van bovenstaande
- Filters werken in alle views (timeline, list, grid)
- Clear button reset alle filters
- Keyboard shortcut: `/` om focus naar search te zetten
- Filter state behouden bij view switch
- Lege resultaten: friendly message met suggestie
- 🛑 **WACHT OP INPUT:** Kies UI componenten voor search bar en filter panel

### Technische details
- **Bestanden aangemaakt:** `src/components/search/SearchBar.tsx`, `src/components/search/AdvancedFilters.tsx`, `src/components/search/FilterTag.tsx`, `src/components/search/EmptyResults.tsx`
- **Store:** `src/store/useFilterStore.ts` (search query, active filters)
- **Supabase queries:** `src/lib/queries/entries.ts` uitbreiden met filter parameters
- **Hooks:** `src/hooks/useSearch.ts`, `src/hooks/useFilters.ts`
- Debounce op input (300ms)
- Full-text search via Supabase of client-side filtering
- Compound filters bouwen als Supabase query

### Definition of Done
- [ ] Smart search bar is zichtbaar en functioneel
- [ ] Typen in search bar filtert entries real-time
- [ ] Geavanceerde filters panel is toegankelijk
- [ ] Filteren op meerdere tags tegelijk werkt
- [ ] Filteren op datumbereik werkt
- [ ] Filteren op entry type werkt
- [ ] Filteren op status werkt
- [ ] Combineren van meerdere filters werkt
- [ ] Clear button reset alle filters
- [ ] `/` keyboard shortcut focust search bar
- [ ] Filters blijven behouden bij view switch
- [ ] Lege resultaten tonen friendly message

### Niet in scope
- AI-powered zoeksuggesties
- Opgeslagen zoekopdrachten
- Zoeken binnen graph view

## Fase 7: Reflectie & Dashboard Elementen

### Doel
Dashboard verrijken met reflectie-elementen die terugblikken op eerdere entries stimuleren.

### Scope
- Random highlight: willekeurige oude entry tonen onder "Herontdek dit..."
- Flashbacks in maandstappen: entries van precies 1, 2, 3, ... maanden geleden
- Meest gebruikte tags (top 3-5) op dashboard
- Contextuele quick actions verbeteren:
  - "Continue editing [laatste entry]"
  - "Review entries from this week"
- Dashboard stats updaten met tag stats
- Klik op reflectie-element opent entry modal
- Refresh mogelijkheid voor random highlight

### Technische details
- **Bestanden aangemaakt:** `src/components/dashboard/RandomHighlight.tsx`, `src/components/dashboard/Flashbacks.tsx`, `src/components/dashboard/TopTags.tsx`
- **Supabase queries:** `src/lib/queries/reflections.ts` (random entry, entries by month offset)
- **Hooks:** `src/hooks/useReflections.ts`, `src/hooks/useTopTags.ts`
- Random entry: query met random ordering + filter op minimum leeftijd (bijv. > 2 weken)
- Maand-flashbacks: query per maandoffset van huidige datum

### Definition of Done
- [ ] "Herontdek dit..." toont een willekeurige oude entry
- [ ] Flashbacks tonen entries per maandstap (1, 2, 3 maanden geleden)
- [ ] Top 3-5 meest gebruikte tags zijn zichtbaar op dashboard
- [ ] Quick actions zijn contextueel (laatste entry, review deze week)
- [ ] Klik op reflectie-element opent entry modal
- [ ] Random highlight kan worden ververst
- [ ] Dashboard voelt informatief maar niet overweldigend

### Niet in scope
- AI-gestuurde reflectie-suggesties
- Notificaties of reminders
- Streaks of gamification

## Fase 8: Entry Verwijzingen & Graph View

### Doel
Entries onderling verbinden en deze verbindingen visualiseren in een interactieve graph.

### Scope
- Entry verwijzingen: simpele referenties naar andere entries vanuit een entry
- "Zie ook: [entry titel]" functionaliteit in entry modal
- Entry zoeken en selecteren voor verwijzing
- Verwijzingen opslaan in entry_references tabel
- Graph view implementeren:
  - Nodes = entries (grootte op basis van aantal connecties)
  - Edges = gedeelde tags (dikte op basis van aantal gedeelde tags)
  - Handmatige verwijzingen ook als edges
  - Force-directed layout
  - Zoom en pan support
  - Klik op node opent entry modal
- Graph view als vierde optie in view switcher
- Broken references afhandelen ("[Verwijderde entry]")
- Performance: max 200 nodes tegelijk, filter opties
- 🛑 **WACHT OP INPUT:** Kies graph visualization library (React Flow, D3.js, of Cytoscape.js)

### Technische details
- **Bestanden aangemaakt:** `src/components/entry/EntryReferences.tsx`, `src/components/entry/ReferenceSelector.tsx`, `src/components/graph/GraphView.tsx`, `src/components/graph/GraphNode.tsx`, `src/components/graph/GraphControls.tsx`
- **Store:** `src/store/useGraphStore.ts`
- **Supabase queries:** `src/lib/queries/references.ts`, `src/lib/queries/graph.ts`
- **Hooks:** `src/hooks/useReferences.ts`, `src/hooks/useGraph.ts`
- **Dependencies:** graph library (te kiezen)
- Force-directed layout algoritme
- WebGL rendering optioneel voor grote graphs
- Cluster entries met veel gedeelde tags

### Definition of Done
- [ ] Verwijzingen naar andere entries kunnen worden toegevoegd in modal
- [ ] Verwijzingen zijn zichtbaar in entry modal als klikbare links
- [ ] Broken references tonen "[Verwijderde entry]"
- [ ] Graph view is beschikbaar via view switcher
- [ ] Nodes representeren entries met juiste grootte
- [ ] Edges tonen tag-gebaseerde connecties met juiste dikte
- [ ] Handmatige verwijzingen zijn zichtbaar als edges
- [ ] Klik op node opent entry modal
- [ ] Zoom en pan werken in graph view
- [ ] Graph is read-only (geen editing in graph)
- [ ] Performance is acceptabel bij 100+ entries

### Niet in scope
- AI-gestuurde verbindingssuggesties
- 3D graph
- Graph editing (drag nodes om verbindingen te maken)
- Export van graph als afbeelding

## Fase 9: AI Tag Suggesties

### Doel
AI-gestuurde tag suggesties bij het aanmaken of bewerken van entries.

### Scope
- API integratie met Claude of OpenAI
- Tag suggesties genereren op basis van titel + content
- Trigger: 500ms debounce na laatste keystroke, minimum 10 karakters
- Suggestie UI: max 5 suggesties, klik om toe te voegen, dismiss om te negeren
- Suggesties verdwijnen na 30 seconden of bij nieuwe input
- Loading state tijdens API call
- Fallback bij API error: geen suggesties tonen, error loggen
- Rate limiting: client-side throttling
- Bestaande tags meenemen als context voor betere suggesties
- 🛑 **WACHT OP INPUT:** Kies AI provider (Anthropic Claude of OpenAI)

### Technische details
- **Bestanden aangemaakt:** `src/lib/ai/tagSuggestions.ts`, `src/components/tags/TagSuggestions.tsx`
- **Hooks:** `src/hooks/useTagSuggestions.ts`
- **API route:** server-side proxy voor API key veiligheid (of Supabase Edge Function)
- **Dependencies:** AI provider SDK
- Debounce 500ms op input
- Client-side rate limiting (max X requests per minuut)
- Suggesties gebaseerd op bestaande tags in systeem + entry content

### Definition of Done
- [ ] AI genereert relevante tag suggesties bij het typen
- [ ] Suggesties verschijnen na 500ms inactiviteit (minimum 10 karakters)
- [ ] Maximaal 5 suggesties worden getoond
- [ ] Klik op suggestie voegt tag toe aan entry
- [ ] Dismiss verwijdert suggestie
- [ ] Loading state is zichtbaar tijdens API call
- [ ] Bij API error worden geen suggesties getoond (geen crash)
- [ ] Rate limiting voorkomt excessive API calls
- [ ] Handmatig tags toevoegen blijft altijd mogelijk
- [ ] AI voelt subtiel en niet opdringerig

### Niet in scope
- AI patroonherkenning over meerdere entries
- AI-gestuurde reflectie-suggesties
- AI content generatie
- Offline AI (lokaal model)

## Fase 10: Responsive Design, Accessibility & Polish

### Doel
Platform volledig responsive maken, toegankelijk voor iedereen, en visueel gepolijst.

### Scope
- **Mobile layout (< 640px):**
  - Tijdlijn wordt verticale lijst
  - Dashboard secties stapelen
  - Sidebar wordt hamburger menu
  - Modal full-screen met slide-up animatie
  - Sticky bottom bar met view toggle icons
  - Touch targets minimaal 44x44px
- **Tablet layout (640px - 1024px):**
  - Smallere tijdlijn en dashboard kolommen
  - Grid 2 kolommen
  - Modal 80% breedte
- **Accessibility (WCAG 2.1 AA):**
  - Keyboard navigatie voor alle functionaliteit
  - Focus indicators
  - ARIA labels en live regions
  - Semantische HTML
  - Kleurcontrast minimaal 4.5:1
  - prefers-reduced-motion respecteren
- **Animaties:**
  - Modal: fade-in backdrop (150ms), scale-up (200ms)
  - View switch: fade transition
  - Hover states: subtle color/opacity
  - Consistent timing
- **Performance:**
  - Code splitting (graph view dynamic import)
  - Image lazy loading en compression
  - Skeleton screens bij loading
  - Target: < 2s FCP, < 3s TTI
- **Dark mode ready:**
  - CSS variables voor light/dark
  - Smooth theme transitie
- **Empty states:**
  - Friendly messages bij geen entries
  - Clear call-to-action
- **Error states:**
  - Duidelijke foutmeldingen
  - Suggesties voor oplossing

### Technische details
- **Bestanden gewijzigd:** alle component bestanden voor responsive styles
- **Bestanden aangemaakt:** `src/components/ui/SkeletonLoader.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/ErrorState.tsx`, `src/components/layout/MobileNav.tsx`
- **CSS:** media queries, CSS custom properties voor theming
- Responsive Tailwind classes (sm:, md:, lg:)
- Dynamic imports voor graph view (`React.lazy`)
- Image optimization pipeline

### Definition of Done
- [ ] Mobile layout werkt correct op schermen < 640px
- [ ] Tablet layout werkt correct op schermen 640-1024px
- [ ] Desktop layout is optimaal op schermen > 1024px
- [ ] Alle functionaliteit is bereikbaar via keyboard
- [ ] Focus indicators zijn duidelijk zichtbaar
- [ ] ARIA labels zijn aanwezig op interactieve elementen
- [ ] Kleurcontrast voldoet aan WCAG 2.1 AA (4.5:1)
- [ ] Animaties respecteren prefers-reduced-motion
- [ ] Graph view wordt lazy geladen
- [ ] Empty states tonen friendly messages
- [ ] Error states zijn informatief en helpend
- [ ] Dark mode is beschikbaar en werkt correct
- [ ] First Contentful Paint < 2s
- [ ] Platform voelt gepolijst en professioneel

### Niet in scope
- PWA (Progressive Web App)
- Offline support
- Push notificaties
- Multi-user / authenticatie
- Custom domain setup
- CI/CD pipeline

## Changelog

| Fase | Status | Samenvatting |
|---|---|---|
| 1 | ✅ Done | Project setup, layout, database schema |
| 2 | ✅ Done | Entry CRUD, modal, formulieren, toast, auto-save |
| 3 | ✅ Done | Timeline view met datum-groepen, dashboard met stats en quick actions, infinite scroll |
| 4 | ✅ Done | Tags systeem met kleuren, autocomplete, tag management, integratie in modal en timeline |
| 5 | ⏳ Todo | List view, grid view, view switching |
| 6 | ⏳ Todo | Smart search, geavanceerde filters |
| 7 | ⏳ Todo | Reflectie-elementen, dashboard verrijking |
| 8 | ⏳ Todo | Entry verwijzingen, graph view |
| 9 | ⏳ Todo | AI tag suggesties |
| 10 | ⏳ Todo | Responsive, accessibility, polish |
