const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, phone, intent, timeline, source } = req.body;

        // Verify required fields
        if (!name || !phone || !intent) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    name: name,
                    phone: phone,
                    intent: intent,
                    timeline: timeline || null,
                    source: source || null
                }
            ]);

        if (error) {
            console.error('Supabase Insert Error:', error);
            return res.status(500).json({ error: 'Database insert failed' });
        }

        return res.status(200).json({ success: true, message: 'Lead submitted successfully' });

    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
