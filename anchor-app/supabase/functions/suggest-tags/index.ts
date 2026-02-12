// supabase/functions/suggest-tags/index.ts
// Supabase Edge Function — AI Tag Suggestions via OpenAI
//
// Environment variable required: OPENAI_API_KEY
// Deploy: supabase functions deploy suggest-tags --no-verify-jwt

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  title: string
  content: string
  entry_type: string
  existing_tags: string[]
  all_tags: string[]
}

interface TagSuggestion {
  name: string
  confidence: number
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate API key is configured
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is niet geconfigureerd')
      return new Response(
        JSON.stringify({ error: 'AI service niet geconfigureerd', suggestions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const { title, content, entry_type, existing_tags, all_tags } = body

    // Validate input
    const combinedText = `${title || ''} ${content || ''}`.trim()
    if (combinedText.length < 10) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build prompt
    const systemPrompt = `Je bent een slimme tag-suggestie assistent voor een persoonlijk leer- en ideeënplatform genaamd "Anchor". 
Gebruikers maken entries aan van verschillende types (lesson, idea, milestone, note, resource, bookmark) en taggen deze.

Je taak:
- Analyseer de titel en inhoud van een entry
- Stel maximaal 5 relevante tags voor
- Tags moeten kort zijn (1-3 woorden), lowercase
- Geef voorkeur aan bestaande tags uit het systeem als die passen
- Stel alleen nieuwe tags voor als er geen passende bestaande tag is
- Tags moeten specifiek en nuttig zijn voor het terugvinden van de entry
- Vermijd te generieke tags zoals "notitie" of "idee"
- Antwoord UITSLUITEND in JSON format

Antwoord formaat (JSON array):
[{"name": "tag-naam", "confidence": 0.9}, ...]

confidence is een score van 0.0 tot 1.0 die aangeeft hoe zeker je bent dat de tag relevant is.`

    const userPrompt = `Entry type: ${entry_type}
Titel: ${title || '(geen titel)'}
Inhoud: ${content || '(geen inhoud)'}

Bestaande tags in het systeem: ${all_tags.length > 0 ? all_tags.join(', ') : '(nog geen tags)'}
Tags al op deze entry: ${existing_tags.length > 0 ? existing_tags.join(', ') : '(nog geen tags)'}

Stel maximaal 5 relevante tags voor. Geef voorkeur aan bestaande tags als die passen.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const messageContent = data.choices?.[0]?.message?.content

    if (!messageContent) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the JSON response
    let parsed: unknown
    try {
      parsed = JSON.parse(messageContent)
    } catch {
      console.error('Failed to parse OpenAI response as JSON:', messageContent)
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle both array and object with suggestions key
    let rawSuggestions: TagSuggestion[]
    if (Array.isArray(parsed)) {
      rawSuggestions = parsed
    } else if (parsed && typeof parsed === 'object' && 'suggestions' in parsed && Array.isArray((parsed as Record<string, unknown>).suggestions)) {
      rawSuggestions = (parsed as { suggestions: TagSuggestion[] }).suggestions
    } else {
      rawSuggestions = []
    }

    // Validate and clean suggestions
    const suggestions: TagSuggestion[] = rawSuggestions
      .slice(0, 5)
      .filter(
        (s: unknown): s is TagSuggestion =>
          typeof s === 'object' &&
          s !== null &&
          'name' in s &&
          typeof (s as TagSuggestion).name === 'string' &&
          (s as TagSuggestion).name.trim().length > 0
      )
      .map((s) => ({
        name: s.name.trim().toLowerCase(),
        confidence: typeof s.confidence === 'number' ? Math.min(1, Math.max(0, s.confidence)) : 0.5,
      }))
      // Filter out tags already on the entry
      .filter((s) => !existing_tags.some((t) => t.toLowerCase() === s.name))

    return new Response(
      JSON.stringify({ suggestions }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ suggestions: [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
