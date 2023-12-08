export default (req, res) => {
    const currentTime = new Date().toISOString();
    res.status(200).json({ currentTime });
};
