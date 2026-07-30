import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const publishableKeys = JSON.parse(
      Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!
    )
    const supabasePublishableKeys = publishableKeys.default

    if (!supabaseUrl || !supabasePublishableKeys) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(
      supabaseUrl,
      supabasePublishableKeys,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError) {
      throw userError
    }

    const secretKeys = JSON.parse(
      Deno.env.get("SUPABASE_SECRET_KEYS")!
    ) 
    const supabaseSecretKeys = secretKeys.default

    if (!supabaseSecretKeys) {
      throw new Error('Missing SUPABASE_SECRET_KEYS')
    }

    const adminClient = createClient(
      supabaseUrl,
      supabaseSecretKeys
    )

    // Get user recipes
    const { data: recipes, error: recipesError } = await adminClient
      .from('recipes')
      .select('id')
      .eq('owner', user.id)

    if (recipesError) {
      throw recipesError
    }

    // Delete recipe images
    const imagePaths = (recipes ?? []).map(recipe => recipe.id);

    if (imagePaths.length > 0) {
      await adminClient.storage
        .from('recipe_images')
        .remove(imagePaths) 
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
    const { error: deleteUserError } =
      await adminClient.auth.admin.deleteUser(user.id)

    if (deleteUserError) {
      throw deleteUserError
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    })

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : JSON.stringify(err),
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
})