import { kv } from '@vercel/kv';

export default async function (req, res) {
    let body = req.body;
    let pageIndex = body.pageIndex;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    const buttonIndexes = [0, 1, 2, 3];  // Hardcoded button indexes
    
    try {
        // Retrieve data from KV store for each buttonIndex
        const counts = await Promise.all(buttonIndexes.map(async buttonIndex => {
            let key = `${pageIndex}-${buttonIndex}`;
            let count = await kv.get(key);
            return count;
        }));

        res.status(200).send(counts);

    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while reading from the database');
    }
};
