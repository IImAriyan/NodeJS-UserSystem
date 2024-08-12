
import express from 'express';
import bodyParser from 'body-parser';
import mysql from "mysql";
import cors from "cors"
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "usersDB",
})



class user {
  userID;
  Username;
  Password;
  constructor(userID = 0,Username = "",Password = "") {
      this.userID = userID
      this.Username = Username
      this.Password = Password
  }
}

var usersList = [];

// New app using express module
const app = express((req,res)=>{
  res.writeHead(200, { 'Content-Type': 'text/plain' });
});

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())


app.use(
    bodyParser.urlencoded({
        extended: true
    })
);



app.get('/api/users-list', (req, res) => {
  const SQL = "SELECT * FROM users"
  db.query(SQL, (err, result) => {
    if (err) {res.send(err)}

    usersList = result;
    res.send(usersList);
  })
});


app.post('/api/users-add',(req,res) =>{
  if (req.body.Username == null) {

    res.statusCode = 400;
    const responseMessage = "Username Is Invalid!"
    res.send(`{ Status":"400","message": "${responseMessage}}"`)

  }else {
    if (req.body.Password == null) {
      res.statusCode = 400;
      const responseMessage = "Password Is Invalid!"
      res.send(`{ Status":"400","message": "${responseMessage}}"`)
    }else {



        const SQL = `INSERT INTO users (Username, Password) VALUES (? , ?)`
        db.query(SQL,[req.body.Username,req.body.Password], (err, result) => {
          if (err) {console.log( err)}
          console.log("New User Added with id = "
              + result.insertId + " Username : "+req.body.Username + " Password: "+req.body.Password) ;
        })

        res.statusCode = 200;
        const responseMessage = "User Succeessfully Added"
        res.send(`{ Status":"200","message": "${responseMessage}"}`)

    }
  }


})



function reloadUserslist() {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {console.log( err)}
    usersList = result;
  })
}


app.post('/api/users-remove/:id',(req,res) =>{
  let findedIndex = 0;
  let IDentered = req.params.id;


  for (let i = 0 ; i< usersList.length ; i++) {
    if (usersList[i].userID == IDentered) {
      res.statusCode = 200;
      const responseMessage = "User Succeessfully Removed";
      res.send(`{ Status":"200","message": "${responseMessage}"}`)

      // Remove User
      const SQL = "DELETE FROM `users` WHERE userID = "+parseInt(IDentered);
      db.query(SQL, (err, result) => {
        console.log("New User Removed with id = " + IDentered );
        console.log(result);
        findedIndex = 1;
      })
    }
  }
  if (findedIndex == 0) {
     res.statusCode = 404;
    const responseMessage = "User Not Found"
    res.send(`{ Status":"404","message": "${responseMessage}"} list : ${usersList }`)

  }

})


app.post('/api/users-update/:id',(req,res) =>{
  let findedIndex = 0;
  let IDentered = req.params.id;

  // Reload Users lIst
  reloadUserslist();

  for (let i = 0 ; i< usersList.length ; i++) {
    if (usersList[i].userID == IDentered) {
      // Update User
      if (req.body.Username == null) {
        res.statusCode = 400;
        const responseMessage = "User Username Is Invalid !!";
        res.send(`{ Status":"400","message": "${responseMessage}"}`)
      }else {
        if (req.body.Password == null) {
          res.statusCode = 400;
          const responseMessage = "User Password Is Invalid !!";
          res.send(`{ Status":"400","message": "${responseMessage}"}`)
        }else {
          // Updating User

          usersList[i].userName = req.body.Username;
          usersList[i].userPassword = req.body.Password;
          const SQL = "UPDATE `users` SET `Username`= ? , `Password`= ? WHERE `userID` = ?"
          findedIndex = 1;

          db.query(SQL,[usersList[i].userName,usersList[i].userPassword,usersList[i].userID], (err, result) => {
            if (err) {console.log( err)}
            res.statusCode = 200;
            const responseMessage = "User Succeessfully Updated";

            res.send(`{ Status":"200","message": "${responseMessage}"}`)
          })

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
        `server is running on port localhost:${port}`
    );
})

