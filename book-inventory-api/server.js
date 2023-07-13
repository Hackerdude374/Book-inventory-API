const express = require("express");
const app = express();
const port = 5000;
const { query } = require("./database");

app.use(express.json());




app.get("/", (req, res) => {
  res.send("Welcome to the Book Inventory API!!!!");
});
//create books

app.post("/books", async (req, res) => {
  const { author, title, NumOfPages, genre } = req.body;

try {
  const newBook = await query(
    "INSERT INTO books (author, title, NumOfPages, genre) VALUES ($1, $2, $3, $4) RETURNING *",
    [author,title,NumOfPages,  genre  ]
  );

  res.status(201).json(newBook.rows[0]);
} catch (err) {
  console.error(err);
}
});

// Get all the books
app.get("/books", async (req, res) => {
  try {
    const allBooks = await query("SELECT * FROM books");
    // rows
    res.status(200).json(allBooks.rows);
  } catch (err) {
    res.status(404).send({ message: "all Books not found" });
    console.error(err);
  }
});

// Get a specific book

app.get("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const book = await query("SELECT * FROM books WHERE id = $1", [bookId]);

    if (book.rows.length > 0) {
      res.status(200).json(book.rows[0]); // Corrected: Changed "job.rows[0]" to "book.rows[0]"
    } else {
      res.status(404).send({ message: "Book has not been found" });
    }
  } catch (err) {
    console.error(err);
  }
});



// Update a specific book
app.patch("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  const { author, title, NumOfPages, genre } = req.body;



  try {
    const updatedBook = await query(
      `UPDATE books SET author = $1, title = $2, NumOfPages = $3, genre = $4 WHERE id = $5 RETURNING *`,
      [author, title, NumOfPages, genre]
    );

    if (updatedBook.rows.length > 0) {
      res.status(200).json(updatedBook.rows[0]);
    } else {
      res.status(404).send({ message: " book not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});

// Delete a specific book
app.delete("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const deleteBook = await query("DELETE FROM books WHERE id = $1", [
      bookId,
    ]);

    if (deleteBook.rowCount > 0) {
      res.status(200).send({ message: "book deleted successfully" });
    } else {
      res.status(404).send({ message: "book not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
