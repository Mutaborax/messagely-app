const express = require('express');
const router = express.Router();
const db = require('../db');
const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const { SECRET_KEY } = require('../config');    


router.get('/:id', ensureLoggedIn, async (req, res) => {
  const messageDetail = await db.getMessageDetail(req.params.id);

  if (req.username !== messageDetail.from_user.username && req.username !== messageDetail.to_user.username) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.json({ message: messageDetail });
});

router.post('/', ensureLoggedIn, async (req, res) => {
  const { to_username, body } = req.body;s
  const from_username = req.username;

  const message = await db.postMessage(from_username, to_username, body);
  return res.json({ message });
});

router.post('/:id/read', ensureLoggedIn, async (req, res) => {
  const message = await db.getMessageDetail(req.params.id);

  if (req.username !== message.to_user.username) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const updatedMessage = await db.markMessageAsRead(req.params.id);
  return res.json({ message: updatedMessage });
});

module.exports = router;

