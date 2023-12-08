const {sql} = require('@vercel/postgres');

async function updateDatabase(msg) {
  await sql`INSERT INTO endorsements (input) VALUES (${msg});
  `
}

module.exports =  async function vote(req, res) {
  if (req) {console.log(req);} else {console.log('req not present')}
  if (req.method === 'POST') {
    try {
      const msg = req.body;
        await updateDatabase(msg);

        res.status(200).json(`successful!`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).json({error: 'Method Not Allowed'});
  }
};