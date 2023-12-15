const router = require('express').Router();
const {signinUser, loginUser, getUser, updateUser, searchUser} =  require('../Controller/user.controller');


router.post('/signin', signinUser);
router.post('/login', loginUser);
router.get('/user-data',getUser );
router.put('/update-user/:id', updateUser);
router.put('/serach-user/:key', searchUser);



module.exports = router;    