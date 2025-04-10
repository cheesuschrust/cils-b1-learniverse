
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  
  if (!token || !email) {
    return new Response(
      'Missing token or email parameter',
      { status: 400, headers: corsHeaders }
    );
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the token (in a real implementation, you would validate the token)
    // For this example, we'll just trust the email parameter
    
    // Update the subscription status
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ status: 'unsubscribed' })
      .eq('email', email);
    
    if (error) {
      throw error;
    }
    
    // Return confirmation page HTML
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Unsubscribed</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .card {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          margin-top: 40px;
        }
        h1 {
          color: #333;
        }
        p {
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4a5568;
          color: white;
          padding: 12px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 500;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Unsubscribed Successfully</h1>
        <p>You have been successfully unsubscribed from our newsletter.</p>
        <p>We're sorry to see you go! If you change your mind, you can always subscribe again.</p>
        <a href="/" class="button">Return to Homepage</a>
      </div>
    </body>
    </html>
    `;
    
    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error handling unsubscribe request:', error);
    
    return new Response(
      `Error: ${error.message}`,
      { status: 500, headers: corsHeaders }
    );
  }
});
