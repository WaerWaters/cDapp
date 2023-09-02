export default async function handler(req, res) {
    const { project, asset } = req.query;
    const url = `https://api.cnft.tools/testingtestings/project/${project}/${asset}`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }