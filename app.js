const express = require("express");
var bodyParser = require('body-parser');
const mongoose=require("mongoose");
const password="wYDaG2VbR8ii8Lh5";
mongoose.connect('mongodb+srv://164sumit20:'+password+'@cluster0.jrbc6fu.mongodb.net/todoBD');
// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://127.0.0.1:27017/todoBD');
const listscheme=mongoose.Schema({
    name:String,
})
const List=mongoose.model("tolist",listscheme);
var first=new List({
    name:"mango",
})
// first.save();
const WList=mongoose.model("worktolist",listscheme);
var wfirst=new WList({
    name:"orange",
})
// wfirst.save();

// const kj=WList.find({name:"orang"}).then(function(itemfound){
//     console.log(itemfound);
//     console.log("first completed");
// })
// .catch(function(err){
//     console.log(err);
// })
// const finditem=async function(){
//     let foundit=await WList.find({});
//     console.log(foundit);
// }
// finditem();



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
var items=[];
var worklist=[];

const listscheme1={
    name:String,
    items:[listscheme]
};

const List1=mongoose.model("User_List",listscheme1);

app.get("/", function (req, res) {
    

    List.find({}).then(function(itemfound){
        res.render('list', { 
            
            day1:"Today",
            items:itemfound,
        });

    })
    
    
})
const defaultitem=[first];

app.get("/:customlistname",function(req,res){
    const cln=req.params.customlistname;
    console.log(cln);
    List1.findOne({name:cln}).then(function(foundlist){
        console.log(foundlist);
        if(!foundlist){
            const list=new List1({
                name:cln,
                items:[]
        
            })
            list.save();
            console.log(cln+" not exsits");
            res.redirect("/"+cln);
        }
        else{
            console.log(cln+"exist");
            res.render('list', { 
                
                day1:cln,
                items:foundlist.items,
            });
        }
    })
    
})




app.post('/',function(req1,res1){
    let item=req1.body.itemname;
    let listname=req1.body.listbutton;
    // console.log(buttonlocation);
    if(listname=="Today"){
        const data=new List({
            name:item,

        })
        data.save();
        // worklist.push(item);
        res1.redirect('/'); 
    }
    else{
        // items.push(req1.body.itemname);
        const data= new List({
            name:item,
        })
        List1.findOne({name:listname}).then(function(founditem){
            const data= new List({
                name:item,
            })
            founditem.items.push(data);
            founditem.save();
            res1.redirect('/'+listname);

        })
        
        

    }
    
    

})

app.post("/delete2",function(req,res){
    console.log(req.body.checkbox);
    
    const item_id=req.body.checkbox;
    // let buttonlocation=req.body.button;
    // console.log(buttonlocation);
        WList.findByIdAndDelete({item_id}).then(()=>{
            res.redirect('/')

        }).catch((err)=>{
            console.log(err);
        });

    // if(buttonlocation==='Work'){
    //     WList.findByIdAndDelete({item_id}).then(()=>{
    //         res.redirect('/work')

    //     }).catch((err)=>{
    //         console.log(err);
    //     });
       
    // }
    // else{
    //     List.findByIdAndDelete({item_id}).then(()=>{
    //         res.redirect('/')

    //     }).catch((err)=>{
    //         console.log(err);
    //     });

    // }

})

app.post("/delete",function(req,res){
    // console.log(req.body);
    const itemid=req.body.checkbox;
    const list=req.body.listname;
    console.log(itemid,list);
    if(list==="Today"){
        List.findByIdAndDelete({_id:itemid}).then(function(){
            res.redirect('/');
        }).catch((err)=>{
            console.log(err);
        })
    }
    else{
        List1.findOneAndUpdate({name:list},{$pull:{items:{_id:itemid}}}).then((foundlist)=>{
            console.log(foundlist);
            res.redirect('/'+list);

        })
    }
})

app.get('/work',function(req,res){
    WList.find({}).then(function(founditem){
        res.render("list",{
            day1:"Work list",
            items:founditem,
    
        })

    })
    // res.render("list",{
    //     day1:"Work list",
    //     items:worklist,

    // })


})

app.get('/about',function(req,res){
    res.render('about');
})


app.listen(3000 || process.env.PORT, function () {
    console.log("server is working at port 3000");
});