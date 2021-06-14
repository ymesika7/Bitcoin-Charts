import express from 'express';
import fs from 'fs';

const router = express.Router();

// @route    GET api/btcData
// @desc     Get all Bitcoin rates
// @access   Private
router.get('/', async (req, res) => {
    try {
      fs.readFile('./btcData.json', 'utf8', function(err, data) { 
        if(err) { 
          res.json(err.message);
        }
        res.json(JSON.parse(data)); 
      });
     
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route    GET api/btcData/:date
// @desc     Get Bitcoin rates for @date
// @access   Private
router.get('/:date', async (req, res) => {
  try {
    fs.readFile('./btcData.json', 'utf8', function(err, data) { 
      if(err) { 
        res.json(err.message);
      }
      res.json(JSON.parse(data)[req.params.date]); 
    });
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
