const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = 3000;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://bngvishu.github.io',
  credentials: true
}));

app.post('/verify-google-token', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    res.cookie('session-token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 3600000
    });

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
