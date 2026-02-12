# Components

## Layout

### Sidebar
**Bron:** Custom
**Status:** ✅ Gekozen
**Notities:** Custom inklapbare sidebar met navigatie-items. Collapsed state toont alleen iconen. Transition-animatie via Tailwind classes.

### Header
**Bron:** Custom
**Status:** ✅ Gekozen
**Notities:** Bevat logo, view toggle buttons (Tijdlijn/Lijst/Grid/Graph), "Nieuw" button (opent EntryTypeSelector), en sidebar toggle. Lucide icons voor alle iconen.

### MainArea
**Bron:** Custom
**Status:** ✅ Gerefactord (Fase 3)
**Notities:** Props-based wrapper component. Rendert Timeline voor timeline-view, Dashboard component rechts. Ontvangt entries, isLoading, hasMore, isLoadingMore, onLoadMore als props vanuit App.tsx. Placeholder divs voor list/grid/graph views.

## Timeline & Dashboard (Fase 3)

### Timeline
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/timeline/Timeline.tsx`
**Notities:** Verticale tijdlijn met datum-groepering (Vandaag/Gisteren/weekdag+datum/volledige datum). Gekleurde connector-dots per entry type op de verticale lijn. IntersectionObserver sentinel voor infinite scroll (batches van 50). Loading, empty en end-of-timeline states. Empty state toont Anchor icoon + "Welkom bij Anchor" + "Eerste entry" knop.

### TimelinePin
**Bron:** Custom
**Status:** ✅ Gebouwd (uitgebreid Fase 4)
**Pad:** `src/components/timeline/TimelinePin.tsx`
**Notities:** Individuele entry op de tijdlijn. Type-icoon in gekleurd afgerond blokje, titel, tijdstip, optionele status badge. Hover tooltip (200ms debounce) toont content preview, entry type badge en datum. Klik opent entry modal. Toont max 3 tag badges + overflow indicator. Gebruikt ENTRY_ICONS map en ENTRY_TYPE_CONFIGS voor kleuren.

### Dashboard
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/dashboard/Dashboard.tsx`
**Notities:** Rechter dashboard wrapper (`w-80 border-l hidden lg:block`). Rendert LatestEntry, StatsPanel en QuickActions. Ontvangt entries, onOpenEntry en onNewEntry als props.

### LatestEntry
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/dashboard/LatestEntry.tsx`
**Notities:** Toont meest recente entry met type-icoon, gekleurde border, content preview en time-ago tekst. `timeAgo()` functie (Zojuist/Xm/Xu/Gisteren/Xd/datum).

### StatsPanel
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/dashboard/StatsPanel.tsx`
**Notities:** 4 stat cards in 2x2 grid: Deze maand (Calendar icoon), Deze week (TrendingUp), Bookmarks (BookmarkCheck), Totaal (FileText). Bevat `calculateStreak()` functie voor opeenvolgende dagen.

### QuickActions
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/dashboard/QuickActions.tsx`
**Notities:** Twee actieknoppen: "Nieuwe entry" (Plus icoon) en "Verder met [laatste entry titel]" (Pencil icoon, alleen zichtbaar als er een latestEntry is).

## Entry Systeem (Fase 2)

### EntryTypeSelector
**Bron:** Custom
**Status:** ✅ Gebouwd
**Notities:** 2x3 grid modal voor kiezen van entry type (lesson, idea, milestone, note, resource, bookmark). Elke type-knop toont icoon, label en beschrijving. Hover-kleuren per type. scaleIn animatie. Gecontroleerd via useEntryStore.

### EntryForm
**Bron:** Custom
**Status:** ✅ Gebouwd
**Notities:** Formulier met type-specifieke velden: titel (altijd), content (label/placeholder varieert per type), optioneel status-veld, optioneel datum-veld. Lokale state per veld die onChange callbacks triggert.

### EntryModal
**Bron:** Custom
**Status:** ✅ Gebouwd (uitgebreid Fase 4)
**Notities:** Centered modal met dimmed/blurry achtergrond. Gekleurde top-border per entry type. Focus trap, Escape sluiten, backdrop click met unsaved-changes confirmatie. Archiveer-knop, verwijder-knop met bevestigingsoverlay. Auto-save integratie (3s debounce) voor bestaande entries. "Opslaan" knop voor nieuwe entries. Tags sectie met TagInput (autocomplete + create). Pending tags flow voor nieuwe entries.

### ToastContainer
**Bron:** Custom
**Status:** ✅ Gebouwd
**Notities:** Fixed-position toast notificaties rechtsonder. Drie varianten: success (groen), error (rood), info (blauw). Iconen (CheckCircle, AlertCircle, Info). Auto-dismiss met configureerbare duur. Sluiten-knop. slideInUp animatie.

## Tags Systeem (Fase 4)

### TagBadge
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/tags/TagBadge.tsx`
**Notities:** Gekleurde pill badge met dot indicator + tekst. Twee maten (sm/md). Optioneel removable met X knop. Klikbaar. Kleur afgeleid van tag.color hex via getTagBgColor/getTagBorderColor utilities.

### TagInput
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/tags/TagInput.tsx`
**Notities:** Combo-input met autocomplete dropdown. Zoekt door bestaande tags, filtert al-toegewezen tags eruit. "Maak [naam]" optie als geen exact match. Keyboard navigatie (up/down/enter/escape). Hash icoon. Outside click sluit dropdown. Werkt voor zowel bestaande entries (direct link) als nieuwe entries (lokale pending state).

### TagManager
**Bron:** Custom
**Status:** ✅ Gebouwd
**Pad:** `src/components/tags/TagManager.tsx`
**Notities:** Beheerpanel voor alle tags. Elke tag toont TagBadge met hover-acties: kleur wijzigen (20-kleuren color picker met actieve check) en verwijderen (met confirmatie overlay). Lege state met icoon. Loading state met skeleton placeholders.
