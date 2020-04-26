'use strict'
require("dotenv").config();
const express=require("express");
const app=express();
const PORT=process.env.PORT;
const superagent=require("superagent");
const methodOverride = require('method-override')
const pg=require("pg");
const client=new pg.Client(process.env.DATABASE_URL);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public')); 
app.set('view engine', 'ejs')
var pokmongallery=[];

app.get("/",(req,res)=>{
    res.redirect("home");
})
app.get("/home",(req,res)=>{
    var url="https://digimon-api.herokuapp.com/api/digimon";
    superagent.get(url)
    .then(pokmon=>{
        let pokmonarr=pokmon.body;
       let pokmonresult=pokmonarr.map(value=>{
            let pokmonitem=new Pokmon(value);
            return pokmonitem;
        })  
        console.log(pokmonresult);
        res.render("home",{pokmon:pokmonresult});     
    })
})

app.post("/add",(req,res)=>{
    let{name,image,level}=req.body;
    console.log(req.name);
    let SQl="INSERT INTO pokmon(name,image,level) VALUES($1,$2,$3);";
    let safevalue=[name,image,level];
    return  client.query(SQl,safevalue)
    .then(()=>{
        res.redirect("fav");
    })

})
app.get("/pokmon/:id",(req,res)=>{
    let SQL="SELECT * FROM pokmon WHERE id=$1";
    let safevalue=[req.params.id];
     return client.query(SQL,safevalue)
    .then((result=>{
        res.render("detail",{item:result.rows});
    }))

})
app.get("/fav",(req,res)=>{
    let SQL="SELECT * from pokmon";
   return client.query(SQL)
    .then((result)=>{
        res.render("fav",{pokmon:result.rows});
    })
})
app.delete("/delete/:id",(req,res)=>{
    let SQL="DELETE FROM pokmon WHERE id=$1";
    let safevalue=[req.params.id];
    client.query(SQL,safevalue)
    .then(()=>{
        res.redirect("/");
    })
})
app.put("/update/:id",(req,res)=>{
    let{name,image,level}=req.body;

    let SQl="UPDATE pokmon SET name=$2,image=$3,level=$4 WHERE id=$1;";
    let safevalue=[req.params.id,name,image,level];
    client.query(SQl,safevalue)
    .then(()=>{
        res.redirect("/");
    })
})
client.connect()
.then(app.listen(PORT,()=>{
    console.log(`port is runing on on port${PORT}`);
}))
app.use("*",(req,res)=>{
    res.status(404).send("page not found");
})
app.use(Error=>{
    res.status(500).send(Error);
})
function Pokmon(pokmon)
{
    this.name=pokmon.name;
    this.image=pokmon.img;
    this.level=pokmon.level;

}
