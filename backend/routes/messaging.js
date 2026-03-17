const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const auth = require('../middlewares/auth');

router.post('/start', auth, messagingController.startConversation);
router.get('/', auth, messagingController.getInbox);
router.get('/:id/messages', auth, messagingController.getMessages);
router.post('/:id/messages', auth, messagingController.sendMessage);
router.delete('/:id/messages', auth, messagingController.deleteAllMessages);

module.exports = router;
