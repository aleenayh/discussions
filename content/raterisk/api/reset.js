const { sql } = require("@vercel/postgres");

async function resetDatabase(voteIndex) {
  await sql`UPDATE intensives_votes 
  SET currentCount = 0, 
  indexSum = 0 
  WHERE voteIndex = ANY(${voteIndex});`;
}

module.exports = async function vote(req, res) {
  if (req) {
    console.log(req);
  } else {
    console.log("req not present");
  }
  if (req.method === "POST") {
    try {
      const body = req.body;
      const voteIndex = Array.from(body.pageIndex);
      await resetDatabase(voteIndex);
      console.log(`reset votes for ${voteIndex}`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
