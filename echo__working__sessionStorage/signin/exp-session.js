// const session = require("express-session");

// // Middleware to set up session management
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Route to handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Dummy authentication logic (replace with your own)
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    // Store user information in the session
    req.session.user = user;
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

// Route to get current user information
app.get("/user", (req, res) => {
  // Check if user is authenticated
  if (req.session.user) {
    // Send user information stored in the session
    res.json(req.session.user);
  } else {
    res.status(401).send("User not authenticated");
  }
});

// Route to handle user logout
app.post("/logout", (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Logout successful");
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
