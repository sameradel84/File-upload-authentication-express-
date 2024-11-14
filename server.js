require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn")
const cors = require("cors")
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');
app.use(cookieParser())  

app.use(express.json())
app.use(express.urlencoded({ extended: true }));    

const corsOptions = require("./config/corsOptions");
app.use(cors(corsOptions))
app.use("/auth", require("./routes/authRoutes"))
app.use('/api', fileRoutes);

app.use('/files', express.static(path.join(__dirname, 'uploads')));
app.use("/users",require("./routes/userRoutes"))

// console.log(process.env.DATABASE_URI);

app.post("/auth/register", authController.register)


app.post("/auth/login", require("./routes/authRoutes"))



connectDB();

mongoose.connection.once("open", () =>
{
    console.log("connect to mongoDB");
    app.listen(5000, () => 
    {
        console.log("the server is running on port 5000"); 
    });
});

mongoose.connection.on("error", (err) =>
{
    console.log(err)
})






















///////////////////////////////////////////////////////////////////////////////
// const mongoose =  require("mongoose")
// const app = express()
// const Users = require("./models/Users");


// app.use(express.json());
// mongoose.connect("mongodb+srv://samer:samer123@cluster0.emwua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  
//     // {
//     //     useNewUrlParser: true, 
//     //     useUnifiedTopology:true
//     // }
// ).then(() => console.log(" MongoDB connected successfully"))
//     .catch((err) => console.log("mongoDB connection Error", err))
    

// //  const mongoURI = "mongodb+srv://samer:samer123@cluster0.emwua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// app.listen(3000, () => 
// {
//     console.log("the server is running on port 3000");
// })



// const users = []   

// app.post('/users', async (req, res) =>
// {
//     const user = req.body
//     console.log(user)
//     // const userFound = users.find((x) => x.id === user.id)
//     // if (userFound)
//     // {
//     //     res.send("user already exist")
//     //     return
//     // }

//     // users.push(user)

//     // res.status(201).send("user created successfully"); 
//     try
//     {
//         const userFound = await Users.findOne({ id: user.id })
//         // console.log(userFound)
//         if (userFound)
//         {
//             res.send("user already exist")
//             return;
//         }
//         const newUser = new Users(user);
//        await newUser.save();
//         res.status(201).send("user created successfully");
//     } catch (err)
//     {
//         res.send(err.message)
//     }
// });

// app.get('/users', async (req, res) =>
// {
//     // if (users.length === 0)
//     // {
//     //     res.status(404).send("user not found")
//     // }
//     // res.send(users);

//     try
//     {
//         const users = await Users.find()
//         console.log(users)
//     if (users.length === 0)
//     {
//         res.status(404).send("user not found")
//     }
//     res.send(users);
//     } catch (err)
//     {
//         res.send(err.message)
//     }
// })

// app.get('/users/:id', (req, res) =>
// {
//      const { id } = req.params 
//      const userFound = users.find((x) => x.id === id)
//     if (!userFound)
//     {
//         res.send("user not found")
//         return
//     }
//     res.send(userFound);
// })


// app.delete('/users/:id',async (req, res) =>
// {
//     // const { id } = req.params
//     // const findUser = users.findIndex((x) => x.id === id)
//     // if (findUser == -1)
//     // {
//     //     res.status(404).send("user not found")
//     //     return
//     // }
//     // users.splice(findUser, 1)
//     // res.send("user deleted successfully")
    
//     try
//     {
//         const { id } = req.params
//         const findUser = await Users.findOneAndDelete({id})
//         if (!findUser)
//         {
//         res.status(404).send("user not found")
//         return
//         }
//         res.send("user deleted successfully")
    
//     } catch (err)
 
//     {
//             res.send(err.message)
//   }
    
// })


// app.put('/users/:id',async (req, res) =>
// {
//     const { id } = req.params
//     const updatedUser = req.body
//     try
//     {
//         const user = await Users.findOneAndUpdate({ id }, updatedUser, { new: true })
//         console.log(user)
//         if (!user)  
//         {
//             res.status(404).send("user not found");
//             return;
//         }
//         res.status(200).send("user updated successfully");
        
//     } catch (err)
//     {
//         res.send(err.message)
//     }
    // const userIndex = users.findIndex((x) => x.id === id) 
    // if (userIndex === -1)
    // {
    //     res.status(404).send("user not found");
    //     return
    // }
     
    //   users[userIndex] = {...users[userIndex] , ...updatedUser} 
    // res.send("user updated successfully")
    
// })

// ///////////////////////////////////

// read 
// app.get("/home", (req,res) =>
// {
//     res.send("this is home page ");
    
// })

// app.get("/about", (req,res) =>
// {
//     res.send("this is about page232 ");
// })


// /// create
// app.post('/addcomment', (req, res) =>
// {
//     res.send("post request on add comment")
// })


// app.get("/getresult", (req, res) =>
// {
//     let numbers = ""
//     for (let i = 0; i <= 100; i++)
//     {
//         numbers += i + "--";
//     }

//     res.send(`the numbers are: ${numbers}`);
// })

// app.get('/sumNumbers/:number1/:number2', (req, res) =>
// {
//     // console.log(req.params)
// req.query
//     const num1 = req.params.number1; 
//     const num2 = req.params.number2;
//     const result = Number(num1) + Number(num2) 
//     res.send(`the total is ${result}`);
// })

// app.get('/sendAge', (req, res) =>
// {

//      console.log(req.query)

//     res.send(`the age is `);
// })

// app.post('/sendBody', (req, res) =>
// {

//     console.log(req.body.name);

//     res.send(`the response is `);
// })

/// put ----- update 


