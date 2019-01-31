var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../image'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname )
  }
});
var upload = multer({storage: storage});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/fileUpload', upload.single('image'),async (req, res, next) => {
  try{
    let {title,content} = req.body;
    let url = req.file.filename;
    let tokenKey = req.headers['x-access-token']  ; 
    let newPost = await insertBlogPost(title,content,url,tokenKey)
    res.json(
      {
          result: 'ok',
          message: 'Them moi bai viet thanh cong',
          data: newPost
      }
    )
  }
  catch(error) {
    res.json(
      {
          result: 'failed',
          message: `Them moi bai viet that bai. Error = ${error}`
      }
    )
  }


});


module.exports = router;
