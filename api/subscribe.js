export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Basic email validation
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // These come from Vercel environment variables — never hardcode these
  const API_KEY       = process.env.MAILCHIMP_API_KEY;        // e.g. abc123-us21
  const LIST_ID       = process.env.MAILCHIMP_LIST_ID;        // Your audience ID
  const DATACENTER    = API_KEY.split('-')[1];                 // e.g. us21

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Mailchimp uses HTTP Basic Auth — username can be anything, password is the API key
        'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',  // Use 'pending' if you want double opt-in
        tags: ['waitlist'],
      }),
    });

    const data = await response.json();

    // Mailchimp returns 200/400 — handle "already subscribed" gracefully
    if (response.ok) {
      return res.status(200).json({ success: true });
    } else if (data.title === 'Member Exists') {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    } else {
      console.error('Mailchimp error:', data);
      return res.status(400).json({ error: data.detail || 'Subscription failed' });
    }

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
