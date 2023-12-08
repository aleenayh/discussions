const {sql} = require('@vercel/postgres');

async function updateDatabase(buttonIndex, voteIndex, indexSum) {
  await sql`UPDATE intensives_votes 
  SET currentCount = currentCount + 1, 
  indexSum = indexSum + ${indexSum} 
  WHERE buttonIndex = ${buttonIndex} AND voteIndex = ${voteIndex};`
}

module.exports =  async function vote(req, res) {
  if (req) {console.log(req);} else {console.log('req not present')}
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const buttonIndex = body.buttonIndex;
      const voteIndex = body.pageIndex;
      const indexSum = body.indexSum;
      if (buttonIndex >= 0 && buttonIndex <= 7) {
        // Update currentCount and indexSum in the database
        await updateDatabase(buttonIndex, voteIndex, indexSum);

        // Retrieve updated data
        const { rows } = await sql`SELECT * FROM intensives_votes WHERE voteIndex = ${voteIndex} ORDER BY buttonIndex ASC;`;
        console.log(rows);
        const counts = rows.map(row => row.currentcount);
        const sums = rows.map(row => row.indexsum);
        console.log(`counts: ${counts}`, `sums: ${sums}`);
        res.status(200).json({counts, sums});
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