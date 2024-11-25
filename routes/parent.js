

const express = require('express');
const router = express.Router();
const { createParent, getParent, updateParent, deleteParent, getAllParents } = require('../controller/parentController');
const parentValidationMW = require('../middleware/parentValidationMW');
const multer = require('multer');
const upload = multer();

router.post('/create-parent', upload.any(), parentValidationMW, createParent);
router.get('/get-parent/:id', getParent);
router.put('/update-parent/:id', updateParent);
router.delete('/delete-parent/:id', deleteParent);
router.get('/get-all-parents', getAllParents);


module.exports = router;