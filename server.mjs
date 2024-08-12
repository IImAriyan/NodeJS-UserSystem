
import express from 'express';
import bodyParser from 'body-parser';

class user {
  userID;
  userName;
  userPassword;
  constructor(userID = 0,userName = "",userPassword = "") {
      this.userID = userID
      this.userName = userName 
      this.userPassword = userPassword
  }
}

const usersList = [];

// New app using express module
const app = express((req,res)=>{
  res.writeHead(200, { 'Content-Type': 'text/plain' });
});

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);



app.get('/api/users-list', (req, res) => {
  // Get complete list of users

  // Send the usersList as a response to the client
  res.send(usersList);
});


app.post('/api/users-add',(req,res) =>{
  if (req.body.userName == null) {

    res.statusCode = 400;
    const responseMessage = "Username Is Invalid!"
    res.send(`{ Status":"400","message": "${responseMessage}}"`)

  }else {
    if (req.body.userPassword == null) {
      res.statusCode = 400;
      const responseMessage = "Password Is Invalid!"
      res.send(`{ Status":"400","message": "${responseMessage}}"`)
    }else {


        let newUser = new user(usersList.length+1,req.body.userName,req.body.userPassword);

        usersList.push(newUser);

        res.statusCode = 200;
        const responseMessage = "User Succeessfully Added"
        res.send(`{ Status":"200","message": "${responseMessage}"}`)

    }
  }


})





app.post('/api/users-remove/:id',(req,res) =>{
  let findedIndex = 0;
  let IDentered = req.params.id;

  for (let i = 0 ; i< usersList.length ; i++) {
    if (usersList[i].userID == IDentered) {
      res.statusCode = 200;
      const responseMessage = "User Succeessfully Removed";
      res.send(`{ Status":"200","message": "${responseMessage}"}`)

      // Remove User
      usersList.splice(i,1)

      findedIndex = 1;
    }
  }

  if (findedIndex == 0) {
     res.statusCode = 404;
    const responseMessage = "User Not Found"
    res.send(`{ Status":"404","message": "${responseMessage}"}`)  
  }

})


app.post('/api/users-update/:id',(req,res) =>{
  let findedIndex = 0;
  let IDentered = req.params.id;

  for (let i = 0 ; i< usersList.length ; i++) {
    if (usersList[i].userID == IDentered) {


      // Update User
      if (req.body.userName == null) {
        res.statusCode = 400;
        const responseMessage = "User Username Is Invalid !!";
        res.send(`{ Status":"400","message": "${responseMessage}"}`)
      }else {
        if (req.body.userPassword == null) {
          res.statusCode = 400;
          const responseMessage = "User Password Is Invalid !!";
          res.send(`{ Status":"400","message": "${responseMessage}"}`)
        }else {
          usersList[i].userName = req.body.userName;
          usersList[i].userPassword = req.body.userPassword;
          res.statusCode = 200;
          const responseMessage = "User Succeessfully Updated";
          res.send(`{ Status":"200","message": "${responseMessage}"}`)
        }
      }

    }
  }

  if (findedIndex == 0) {
     res.statusCode = 404;
    const responseMessage = "User Not Found"
    res.send(`{ Status":"404","message": "${responseMessage}"}`)  
  }
});

const port = 7740;

app.listen(port,function () {
    console.log(
        `server is running on port 127.0.0.1:${port}`
    );

})

