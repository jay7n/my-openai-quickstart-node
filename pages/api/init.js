const roleName = 'Jayson';
const gender = 'him';
const aiName = 'Jarvis';
const greeting = `${aiName}: Hello ${roleName}, how can I help you today?"`;

export default async function (req, res) {
  const {

  } = req.body;

  const sid = new Date().getTime();
  console.log('sid = ', sid);

  res.status(200).json({
    sid: sid,
    greeting: greeting,
  });
}