import { createClient } from '@supabase/supabase-js'

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

/**
 * Get the origins that are allowed to call this function, from the ALLOWED_ORIGINS secret
 * (comma-separated), falling back to the local development server
 */
function getAllowedOrigins(): string[] {
  const origins = Deno.env.get('ALLOWED_ORIGINS')

  if (!origins) return DEFAULT_ALLOWED_ORIGINS

  return origins.split(',').map((origin) => origin.trim()).filter(Boolean)
}

/**
 * Build the response headers, only allowing the request's origin when it is on the allow list
 */
function getHeaders(req: Request): Headers {
  const headers = new Headers({
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  })

  const origin = req.headers.get('Origin')

  if (origin && getAllowedOrigins().includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return headers
}

/**
 * Create a JSON response
 */
function jsonResponse(body: Record<string, unknown>, status: number, headers: Headers): Response {
  return new Response(JSON.stringify(body), { status, headers })
}

/**
 * Get the default key from a Supabase keys secret, which is a JSON object of named keys
 */
function getDefaultKey(name: string): string {
  const value = Deno.env.get(name)

  if (!value) {
    throw new Error(`Missing environment variable ${name}`)
  }

  const key = JSON.parse(value).default

  if (!key) {
    throw new Error(`Missing default key in environment variable ${name}`)
  }

  return key
}

Deno.serve(async (req) => {
  const headers = getHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, headers)
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return jsonResponse({ error: 'Missing Authorization header' }, 401, headers)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')

    if (!supabaseUrl) {
      throw new Error('Missing environment variable SUPABASE_URL')
    }

    const supabase = createClient(supabaseUrl, getDefaultKey('SUPABASE_PUBLISHABLE_KEYS'), {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401, headers)
    }

    const adminClient = createClient(supabaseUrl, getDefaultKey('SUPABASE_SECRET_KEYS'))

    // Get user recipes
    const { data: recipes, error: recipesError } = await adminClient
      .from('recipes')
      .select('id')
      .eq('owner', user.id)

    if (recipesError) {
      throw recipesError
    }

    // Delete recipe images
    const imagePaths = (recipes ?? []).map((recipe) => recipe.id)

    if (imagePaths.length > 0) {
      const { error: imagesError } = await adminClient.storage
        .from('recipe_images')
        .remove(imagePaths)

      if (imagesError) {
        throw imagesError
      }
    }

    // Delete recipes
    const { error: recipeDeleteError } = await adminClient
      .from('recipes')
      .delete()
      .eq('owner', user.id)

    if (recipeDeleteError) {
      throw recipeDeleteError
    }

    // Delete auth user
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteUserError) {
      throw deleteUserError
    }

    return jsonResponse({ success: true }, 200, headers)
  } catch (err) {
    console.error('Failed to delete user:', err)

    return jsonResponse({ error: 'Failed to delete account' }, 500, headers)
  }
})
