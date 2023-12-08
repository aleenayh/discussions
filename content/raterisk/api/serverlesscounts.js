/* import {sql} from '@vercel/postgres'; */

const {sql} = require('@vercel/postgres');

module.exports =  async function (req, res) {
  let body = req.body;
  let pageIndex = body.pageIndex;
  res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        // Retrieve data from the database
        const { rows } = await sql`SELECT * FROM intensives_votes WHERE voteIndex = ${pageIndex} ORDER BY buttonIndex ASC;`;
        const counts = rows.map(row => row.currentcount);
        const sums = rows.map(row => row.indexsum);
        console.log(`counts: ${counts}`, `sums: ${sums}`);
        res.status(200).json({counts, sums});
    } 
    catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while reading from the database');
      console.log(`res: ${res}`);
    }
};
