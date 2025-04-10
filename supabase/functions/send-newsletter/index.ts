
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

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body
    const { subject, content, recipientFilter } = await req.json();
    
    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get recipients based on filter
    let query = supabase
      .from('newsletter_subscriptions')
      .select('email');
    
    // Only send to active subscribers
    query = query.eq('status', 'active');
    
    // Apply additional filters if provided
    if (recipientFilter?.tags?.length) {
      query = query.contains('tags', recipientFilter.tags);
    }
    
    const { data: recipients, error: fetchError } = await query;
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No recipients match the criteria' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, you would:
    // 1. Use an email service like SendGrid, Mailchimp, etc.
    // 2. Log the email sending in a database
    // 3. Handle rate limits and batching for large subscriber lists
    
    // Record the campaign in the database
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .insert({
        subject,
        content,
        recipient_count: recipients.length,
        status: 'sent'
      })
      .select()
      .single();
    
    if (campaignError) {
      console.error('Error recording campaign:', campaignError);
    }
    
    // Update the last_email_sent timestamp for all recipients
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({ last_email_sent: now })
      .in('email', recipients.map(r => r.email));
    
    if (updateError) {
      console.error('Error updating last_email_sent:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        recipientCount: recipients.length,
        message: `Newsletter scheduled for delivery to ${recipients.length} recipients` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending newsletter:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
