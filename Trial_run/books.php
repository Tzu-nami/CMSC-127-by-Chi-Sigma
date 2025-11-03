<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Books</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container my-5">
        <h1>List of Books</h1>
        <a class="btn btn-primary" href="/cs127_booksTrial/createBook.php" role="button">New Book</a>
        <br>

        <table class = "table">
            <thead>
                <th>Book ID</th>
                <th>Book Title</th>
                <th>Book Year</th>
                <th>Book Publisher</th>
                <th>Book Copies</th>
            </thead>

            <tbody>
                <?php
                    // Database connection parameters
                    $servername = 'localhost';
                    $user = 'root';
                    $pass = '';
                    $database = 'cs127_books';

                    $conn = new mysqli($servername, $user, $pass, $database);

                    // Check connection
                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }

                    $sql = "SELECT * FROM BOOKS_DATA";
                    $result = $conn->query($sql);
                    if (!$result) {
                        die("Query failed: " . $conn->error);
                    }

                    while ($row = $result->fetch_assoc()) {
                        echo "
                        <tr>
                            <td>$row[BOOK_ID]</td>
                            <td>$row[BOOK_TITLE]</td>
                            <td>$row[BOOK_YEAR]</td>
                            <td>$row[BOOK_PUBLISHER]</td>
                            <td>$row[BOOK_COPIES]</td>
                            <td> 
                                <a class='btn btn-primary' href='/cs127_booksTrial/editBooks.php?BOOK_ID=$row[BOOK_ID]'>Edit</a>
                                <a class='btn btn-danger' href='/cs127_booksTrial/delete.php?BOOK_ID=$row[BOOK_ID]'>Delete</a> 
                            </td>
                        </tr>";
                    }
                    $conn->close();
                    ?>
            </tbody>
        </table>
    </div>
</body>
</html>