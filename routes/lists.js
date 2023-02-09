const router = require("express").Router();
const List = require("../models/List");
const verify = require("../utils/verifyToken");

//CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const saveList = await newList.save();
      return res.status(200).json(saveList);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Yuo can't Create new List");
  }
});

//DELETE
router.post("/delete/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      return res.status(200).json("The List has deleted successfully");
    } catch (err) {
      return  res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Yuo can't delete  List");
  }
});
// GET /lists filtered by type and genre
router.get("/",verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuerry = req.query.genre;
  let list = [];
  if (req.user.isAdmin) {
    try {
      if (typeQuery) {
          if (genreQuerry) {
              list = await List.aggregate([
                  { $sample: { size: 10 } },
                  { $match: { type: typeQuery, genre: genreQuerry } },
                 
              ]);
              console.log(genreQuerry);
          } else {
              list = await List.aggregate([
                { $sample: { size: 10 } },
                { $match: { type: typeQuery } },
              ])
              console.log(typeQuery);
           }
      } else {
          list = await List.aggregate([{ $sample: { size: 10 } }]);
          console.log('lista generale');
      }

     return res.status(200).json(list);
    } catch (err) {
      return res.status(500).json(err); 
    }
  } else {
    return res.status(403).json("Yuo can't see List");
  }
}); 
// router.get("/", verify, async (req, res) => {
//   const typeQuery = req.query.type;
//   const genreQuerry = req.query.genre;
//   let list = [];

//   try {
//     if (typeQuery) {
//       if (genreQuerry) { 
//         list = await List.aggregate([  
//           { $sample: { size: 10 } }, 
//           { $match: { type: typeQuery, genre: genreQuerry } },
//         ]);
//       } else {
//         list = await List.aggregate([
//           { $sample: { size: 10 } },
//           { $match: { type: typeQuery } }, 
//         ]);
//       }
//     } else {
//       list = await List.aggregate([{ $sample: { size: 10 } }]); 
//     } 

//     res.status(200).json(list);
//   } catch (err) {
//     res.status(500).json({ error: "An error occurred while retrieving the list." });
//   }
// });
module.exports = router;
