export const getHome = (req, res) => {
  res.send('Hello Express!');
};

export const getBackendStatus = (req, res) => {
  res.json({ message: 'Backend Connected' });
};
