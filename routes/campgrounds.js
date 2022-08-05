const express = require('express')
const CatchAsync = require('../utils/CatchAsync')
const { isLoggedIn, isAuthorized, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const { storage } = require('../cloudinary')    //as we have index.js in that directory node automatically exports that file
const multer  = require('multer')
const upload = multer({ storage })
const router = express.Router()

router.route('')
    .get(CatchAsync(campgrounds.index))       //LIST------------------------------------------------------------------------
    .post(isLoggedIn, upload.array('images'), validateCampground, CatchAsync(campgrounds.newCampground))  //NEW-------------------------------------
            //Do not upload images before verifying like we do here change it in future
router.get('/new', isLoggedIn, campgrounds.newForm)    //NEW FORM-----------------------------------------------------------------

router.route('/:id')
    .get(CatchAsync(campgrounds.details)) //DETAILS---------------------------------------------------------------------
    .put(isLoggedIn, isAuthorized, upload.array('images'), validateCampground, CatchAsync(campgrounds.editCampground))  //EDIT--------------------------------------
    .delete(isLoggedIn, isAuthorized, CatchAsync(campgrounds.deleteCampground))   //DELETE------------------------------

router.get('/:id/edit', isLoggedIn, isAuthorized, CatchAsync(campgrounds.editForm)) //EDIT FORM-----------------------------------

module.exports = router