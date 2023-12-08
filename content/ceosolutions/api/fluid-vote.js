/* import {sql} from '@vercel/postgres/dist/index-node.js'; */

const {sql} = require('@vercel/postgres');

async function increaseDatabase(buttonIndex,voteIndex) {
  await sql`UPDATE intensives_votes 
  SET currentCount = currentCount + 1 
  WHERE buttonIndex = ${buttonIndex} AND voteIndex = ${voteIndex};`
}
async function decreaseDatabase(buttonIndex,voteIndex) {
  await sql`UPDATE intensives_votes 
  SET currentCount = currentCount - 1 
  WHERE buttonIndex = ${buttonIndex} AND voteIndex = ${voteIndex};`
}

module.exports =  async function vote(req, res) {
  if (req) {console.log(req);} else {console.log('req not present')}
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const buttonIndex = body.buttonIndex;
      const voteIndex = body.pageIndex;
      const oldButtonIndex = body.oldButtonIndex;
      if (oldButtonIndex !== -1) {
        await decreaseDatabase(oldButtonIndex, voteIndex);
      }
      if (buttonIndex >= 0 && buttonIndex <= 7) {
        // Update currentCount in the database
        await increaseDatabase(buttonIndex, voteIndex);

        // Retrieve updated data
        const { rows } = await sql`SELECT * FROM intensives_votes WHERE voteIndex = ${voteIndex} ORDER BY buttonIndex ASC;`;
        console.log(rows);
        const counts = rows.map(row => row.currentcount);
        console.log(`counts: ${counts}`);
        res.status(200).json(counts);
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
