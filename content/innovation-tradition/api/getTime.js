export default (req, res) => {
    const currentTime = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
    res.status(200).json({ currentTime });
  };
