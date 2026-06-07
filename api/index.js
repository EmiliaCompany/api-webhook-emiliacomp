let donations = [];
let key = [ "ab97jsu42" ]

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const { apikey } = req.query
    if (!apikey || !key.includes(apikey)) return res.status(403).json({message:"APIKEY required"})
    donations.push(data);
    res.status(200).json({ message: 'Donation received!' });
  } else if (req.method === 'GET') {
    res.status(200).json(donations);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
