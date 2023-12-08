import { kv } from '@vercel/kv';

async function updateDatabase(buttonIndex, voteIndex) {
  let key = `${voteIndex}-${buttonIndex}`;
  let value = await kv.get(key)
  
  if (!value) value = 0;
  value++;
  
  await kv.set(key, value.toString())  // Converts number to string, as KV only allows strings as values
}

export default async function vote(req, res) {
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const buttonIndex = body.buttonIndex;
      const voteIndex = body.pageIndex;
      if (buttonIndex >= 0 && buttonIndex <= 7) {
        // Update currentCount in the KV
        await updateDatabase(buttonIndex, voteIndex);

        const allButtons = [0, 1, 2, 3];  // Hardcoded button indexes
    

            // Retrieve data from KV store for each buttonIndex
            const counts = await Promise.all(allButtons.map(async button => {
                let key = `${voteIndex}-${button}`;
                let count = await kv.get(key);
                return count;
            }));
    
            res.status(200).send(counts);



      } else {
        res.status(400).json({ message: 'Invalid button index.' });
      }
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).json({error: 'Method Not Allowed'});
  }
};
