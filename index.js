const express = require("express");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const app = express();

const connect = ()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/mvc_assign")
}

//SECTION SCHEMA
const sectionSchema = new mongoose.Schema({
  name:{type:String, required:true},
  book:[{type:mongoose.Schema.Types.ObjectId, ref:"book", required:true}]

  
},{
    versionKey:false,
    timestamps:true
});


const Section = mongoose.model("section" , sectionSchema);

//NOT CHEKCED OUT BOOK SCHEMA 

const notCheckoutsectionSchema = new mongoose.Schema({
    name:{type:String, required:true},
    not_CheckedOut_book:[{type:mongoose.Schema.Types.ObjectId, ref:"book", required:true}],

  },{
      versionKey:false,
      timestamps:true
  });
  
  
  const notCheckedSection = mongoose.model("notcheckedsection" , notCheckoutsectionSchema);


  //BOOK SCHEMA
const bookSchema = new mongoose.Schema({
    name:{type:String, required:true},
    body:{type:String, required:true},
    author:[{type:mongoose.Schema.Types.ObjectId, ref:"author", required:true}],
    section:{type:mongoose.Schema.Types.ObjectId, ref:"section", required:true}
}
,{
    versionKey:false,
    timestamps:true
}
);

const Book = mongoose.model("book" , bookSchema);


// AUTHOR SCHEMA

const authorSchema = new mongoose.Schema({
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    book:[{type:mongoose.Schema.Types.ObjectId, ref:"book", required:true}]

},{
    versionKey:false,
    timestamps:true
});

const Author = mongoose.model("author" , authorSchema);


//CHECKED OUT SCHEMA

const CheckedOutSchema =  new mongoose.Schema({
    books:{
        type:mongoose.Schema.Types.ObjectId, ref:"book", required:true
    }

  }  ,{
        versionKey:false,
        timestamps:true
    });


    const Checked = mongoose.model("checked" , CheckedOutSchema);


    //question 5 schema

     const sectionAuthorSchema = new mongoose.Schema({
         name_of_section:{type:String, required:true},
         author:{type:mongoose.Schema.Types.ObjectId, ref:"author", required:true},
         book:[{type:mongoose.Schema.Types.ObjectId, ref:"book", required:true}]
     })



     const sectionAuthor = mongoose.model("sectionauthor" , sectionAuthorSchema);




    // CONTROLLERS

    app.use(express.json());

    app.post("/sections" , async (req , res) => {
        try{
           const section = await Section.create(req.body);
           return res.status(201).send(section);
        }
        catch (e){
            return res.status(500).send(e.message);
        }
    });
    
    app.get("/sections" , async (req , res)=> {
        try{
             const section = await Section.find().populate({path: "book", select: { name:1, _id:0}}).lean().exec();
             return res.status(201).send(section);
        } catch(e){
            return res.status(500).send(e.message);
        }
    });

        //find books in a section  QUESTION 3 //
    
    app.get("/sections/:id" , async(req , res) =>{
       try{
          const section =  await Section.findById(req.params.id).populate({path: "book", select: { name:1, _id:0}}).lean().exec();;
          return res.status(201).send(section);
       } catch(e){
           return res.status(500).send(e.message);
       }
    });


    
    app.patch("/sections/:id" , async (req,res) => {
        try{
           const section = await Section.findByIdAndUpdate(req.params.id , req.body).lean().exec();
           return res.status(200).send(section);
        } catch(e){
            res.status(500).send(e.message);
        }
    
    })
    
    app.delete("/sections/:id", async (req, res) =>{
        try{
           const section = await Section.findByIdAndDelete(req.params.id).lean().exec();
           return res.status(201).send(section);
        } catch(e){
            res.status(500).send(e.message)
        }
    })


//NOT CHEKCED OUT BOOK CONTROLLER 

app.post("/notChecksSections" , async (req , res) => {
    try{
       const notcheckedsection = await notCheckedSection.create(req.body);
       return res.status(201).send(notcheckedsection);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
});

//find books in a section that are not checked out QUESTION 4 //

app.get("/notChecksSections/:id" , async(req , res) =>{
    try{
       const notcheckedsection =  await notCheckedSection.findById(req.params.id).populate({path: "not_CheckedOut_book", select: { name:1, _id:0}}).lean().exec();;
       return res.status(201).send(notcheckedsection);
    } catch(e){
        return res.status(500).send(e.message);
    }
 });


    console.log("part 2 BOOKS");

app.post("/books" , async (req , res) => {
    try{
       const book = await Book.create(req.body);
       return res.status(201).send(book);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
});

  app.get("/books" , async (req , res)=> {
    try{
         const book = await Book.find().populate("author").populate("section").lean().exec();
         return res.status(201).send(book);
    } catch(e){
        return res.status(500).send(e.message);
    }
});

app.get("/books/:id" , async (req , res)=> {
    try{
         const book = await Book.findById(req.params.id).populate("author").populate("section").lean().exec();
         return res.status(201).send(book);
    } catch(e){
        return res.status(500).send(e.message);
    }
});

app.patch("/books/:id" , async (req,res) => {
    try{
       const book = await Book.findByIdAndUpdate(req.params.id , req.body).lean().exec();
       return res.status(200).send(book);
    } catch(e){
        res.status(500).send(e.message);
    }

})
app.delete("/books/:id", async (req, res) =>{
    try{
       const book = await Book.findByIdAndDelete(req.params.id).lean().exec();
       return res.status(201).send(book);
    } catch(e){
        res.status(500).send(e.message)
    }
})

console.log("part 3  Author")
 
app.post("/authors" , async (req , res) => {
    try{
       const author = await Author.create(req.body);
       return res.status(201).send(author);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
});

app.get("/authors" , async (req , res)=> {
    try{
         const author  = await Author.find().populate({path: "book", select: { name:1, _id:0}}).lean().exec();
         return res.status(201).send(author);
    } catch(e){
        return res.status(500).send(e.message);
    }
});

//find all books written by an author -- SECOND QUESTION //

app.get("/authors/:id" , async (req , res)=> {
    try{
         const author  = await Author.findById(req.params.id).populate({path: "book", select: { name:1, _id:0}}).lean().exec();
         return res.status(201).send(author);
    } catch(e){
        return res.status(500).send(e.message);
    }
});

app.patch("/authors/:id" , async (req,res) => {
    try{
       const author = await Author.findByIdAndUpdate(req.params.id , req.body).lean().exec();
       return res.status(200).send(author);
    } catch(e){
        res.status(500).send(e.message);
    }

})
app.delete("/authors/:id", async (req, res) =>{
    try{
       const author = await Author.findByIdAndDelete(req.params.id).lean().exec();
       return res.status(201).send(post);
    } catch(e){
        res.status(500).send(e.message)
    }
})
  


console.log("part 4  COMMENT")


//post the  books that are checked out from below controllers

app.post("/checked" , async (req , res) => {
    try{
       const checked = await Checked.create(req.body);
       return res.status(201).send(checked);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
});

//find books that are checked out// FIRST QUESTION//


app.get("/checked" , async (req , res)=> {
    try{
         const checked  = await Checked.find().
         populate("books").
         lean().exec();
         return res.status(201).send(checked);
    } catch(e){
        return res.status(500).send(e.message);
    }
});



// sectionAuthor CONTROLLER


app.post("/sectionAuthor" , async (req , res) => {
    try{
       const sectionauthor = await sectionAuthor.create(req.body);
       return res.status(201).send(sectionauthor);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
});

//find books of 1 author inside a section // QUESTION 5

  app.get("/sectionAuthor" , async (req , res)=> {
    try{
         const sectionauthor = await sectionAuthor.find().populate("author").populate({path: "book", select: { name:1, _id:0}}).lean().exec();
         return res.status(201).send(sectionauthor);
    } catch(e){
        return res.status(500).send(e.message);
    }
});

//find books of 1 author inside a section // QUESTION 5

app.get("/sectionAuthor/:id" , async (req , res)=> {
    try{
         const sectionauthor = await sectionAuthor.find().populate("author").populate({path: "book", select: { name:1, _id:0}}).lean().exec();
         return res.status(201).send(sectionauthor);
    } catch(e){
        return res.status(500).send(e.message);
    }
});




    app.listen (2345, async () => {
        try{
         await connect();
         console.log("listening on port 2345")
        } catch (e){
           console.log(e.message)
        }
    });