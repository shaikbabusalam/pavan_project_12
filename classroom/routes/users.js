const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send('GET for users');

})
router.get("/:id",(req,res)=>{
    res.send("GET FOR users");
})
router.post("/",(req,res)=>{
    res.send("POST FOR users");
})
router.delete("/:id",(req,res)=>{
    res.send("delete FOR users");
})

module.exports = router;