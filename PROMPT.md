# Prompt: Uitgewerkt Plan → Gefaseerd Bouwplan voor AI Agent

## Wat je krijgt

Hieronder staat een volledig uitgewerkt plan voor een interactieve website. Dit plan is al compleet — er hoeven geen vragen gesteld te worden over het idee zelf. Jouw taak is puur **structureel**: vorm dit plan om tot een gefaseerd bouwplan dat een AI agent (Copilot in VS Code) stap voor stap kan uitvoeren.

## Jouw opdracht

1. **Lees het volledige plan** hieronder
2. **Identificeer logische bouwblokken** — groepeer gerelateerde onderdelen
3. **Orden deze in fases** zodat elke fase voortbouwt op de vorige en op zichzelf een werkend resultaat oplevert
4. **Schrijf het uit** in het format hieronder
5. **Vul de projectbestanden in**: `ROADMAP.md`, `TODO.md`, `.github/copilot-instructions.md`

## Fase-format

Schrijf elke fase als volgt:

```
## Fase [nummer]: [Titel]

### Doel
Wat deze fase oplevert in één zin.

### Scope
- Concrete, actionable taken
- Alles wat in deze fase gebouwd wordt

### Technische details
- Bestanden die worden aangemaakt of gewijzigd
- Libraries/dependencies
- Architectuurbeslissingen

### Definition of Done
- [ ] Criterium 1: specifiek en testbaar
- [ ] Criterium 2: specifiek en testbaar
- [ ] Criterium 3: specifiek en testbaar

### Niet in scope
Wat expliciet NIET in deze fase zit.
```

## Principes voor het opdelen in fases

- **Elke fase levert iets werkends op** dat ik in de browser kan zien
- **Fases zijn logisch voor een AI agent** — niet te groot (verliest focus), niet te klein (overhead)
- **Vroege fases = fundament**, latere fases = verfijning en polish
- **Dependencies eerst** — als fase 3 iets nodig heeft uit fase 2, moet fase 2 dat bevatten
- **Geen tijdschattingen** — alleen fases en stappen


## UI Componenten & Design Decisions

Bij het maken van fases waarbij UI componenten worden geïmplementeerd:

**In ROADMAP.md per fase:**
- Vermeld expliciet welke UI componenten nodig zijn
- Markeer deze als "Design Decision Needed" als ze nog gekozen moeten worden

**In TODO.md:**
- Voeg taken toe zoals: "🛑 WACHT OP INPUT: Kies component voor [x]"
- Pas nadat component gekozen is, komt de implementatie taak

**Maak COMPONENTS.md aan:**
- Dit bestand documenteert alle gekozen componenten
- Format per component:
```markdown
  ## [Component naam]
  **Bron:** [21st.dev link / custom / etc.]
  **Status:** ⏳ Nog te kiezen / ✅ Gekozen
  **Code/Link:** [hier]
  **Notities:** [eventuele aanpassingen]
```

**Workflow:**
1. Agent komt bij UI component taak
2. Agent vraagt: "Wil je zelf een component kiezen of zal ik er een maken?"
3. Bij keuze gebruiker → documenteer in COMPONENTS.md
4. Agent implementeert vervolgens het gekozen/gemaakte component

## Projectbestanden

Na het opdelen, vul deze drie bestanden in:

### `ROADMAP.md`
- Overzicht van alle fases met status (`⏳ Todo` / `🔄 In Progress` / `✅ Done`)
- Per fase: scope samenvatting + volledige Definition of Done checklist
- Huidige fase duidelijk gemarkeerd

### `TODO.md`
- Taken voor fase 1 (de eerste fase die gebouwd gaat worden)
- Parking lot sectie voor notities en ideeën

### `.github/copilot-instructions.md`
- Project-context gebaseerd op het plan
- Tech stack
- Design system referenties
- Instructie om altijd eerst `ROADMAP.md` en `TODO.md` te lezen
- Conventies (geen horizontale lijnen tussen secties, fases geen tijdschattingen, taken moeten specifiek en actionable zijn)

## Werkwijze na het plan

Bij het **starten** van een fase:
1. Lees `ROADMAP.md` en `TODO.md`
2. Bevestig scope met mij
3. Bouw

Bij het **afsluiten** van een fase:
1. Loop de Definition of Done checklist door
2. Update `ROADMAP.md` — markeer fase als ✅ Done
3. Update `TODO.md` — clear completed, noteer parking lot
4. Geef samenvatting: wat is gedaan, wat werkt, wat is de volgende fase
5. **Wacht op mijn goedkeuring** voordat je doorgaat

Bij een **nieuwe chat**:
1. Lees `.github/copilot-instructions.md`
2. Lees `ROADMAP.md` en `TODO.md`
3. Hervat waar we gebleven zijn

## Regels

- **Niet het idee herontwerpen** — het plan is compleet, jij structureert het alleen in fases
- **Eén fase tegelijk** — vraag goedkeuring voor je doorgaat
- **Altijd werkend** — na elke fase moet het project in de browser runnen
- **Documentatie is verplicht** — update ROADMAP.md en TODO.md bij elke fase-overgang
- **Wees specifiek** — geen vage taken, alles moet actionable zijn

---

## Het Plan

Lees het volledige plan in `Anchorvisie.md` in de project root.
