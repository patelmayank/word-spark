import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Update quote function called with method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    // Accept both POST and PUT requests (supabase.functions.invoke uses POST)
    if (req.method !== 'POST' && req.method !== 'PUT') {
      console.error('Invalid method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing token' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      console.log(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { quote_id, quote_text, author_name } = requestBody;

    // Validate quote_id
    if (!quote_id || typeof quote_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Quote ID is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate quote_text
    if (!quote_text || typeof quote_text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Quote text is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const trimmedQuote = quote_text.trim();
    
    // Validate quote length
    if (trimmedQuote.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Quote must be at least 10 characters long' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (trimmedQuote.length > 280) {
      return new Response(
        JSON.stringify({ error: 'Quote must be no more than 280 characters long' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and set author_name
    let finalAuthorName = 'Unknown';
    if (author_name && typeof author_name === 'string' && author_name.trim()) {
      finalAuthorName = author_name.trim();
    }

    console.log(`User ${user.id} updating quote ${quote_id}: "${trimmedQuote}" by ${finalAuthorName}`);

    // First, verify the quote exists and belongs to the user
    const { data: existingQuote, error: fetchError } = await supabaseClient
      .from('quotes')
      .select('*')
      .eq('id', quote_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching quote for verification:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Quote not found or you do not have permission to edit it' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Failed to verify quote ownership' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!existingQuote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found or you do not have permission to edit it' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update the quote
    const { data, error: updateError } = await supabaseClient
      .from('quotes')
      .update({
        quote_text: trimmedQuote,
        author_name: finalAuthorName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quote_id)
      .eq('user_id', user.id) // Double-check ownership in the update
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update quote in database' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Quote successfully updated:', data);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Quote updated successfully!',
        quote: data 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in update-quote function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});