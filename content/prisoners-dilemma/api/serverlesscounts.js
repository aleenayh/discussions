/* import {sql} from '@vercel/postgres'; */

const {sql} = require('@vercel/postgres');

module.exports =  async function (req, res) {
  let body = req.body;
  let pageIndex = body.pageIndex;
  res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        // Retrieve data from the database
        const { rows } = await sql`SELECT * FROM intensive_votes WHERE voteIndex = ${pageIndex} ORDER BY buttonIndex ASC;`;
        const counts = rows.map(row => row.currentcount);
        res.status(200).send(counts);
    } 
    catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while reading from the database');
      console.log(`res: ${res}`);
    }
};
