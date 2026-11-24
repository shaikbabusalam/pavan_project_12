const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("post FOR users");
})
router.get("/:id",(req,res)=>{
    res.send("post FOR users");
})
router.post("/",(req,res)=>{
    res.send("post FOR users");
})
router.delete("/:id",(req,res)=>{
    res.send("delete FOR users");
})

module.exports = router;