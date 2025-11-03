<?php
$servername = 'localhost';
$user = 'root';
$pass = '';
$database = 'cs127_books';

// Create connection
$conn = new mysqli($servername, $user, $pass, $database);

$BOOK_ID = "";
$BOOK_TITLE = "";
$BOOK_YEAR = "";
$BOOK_PUBLISHER = "";
$BOOK_COPIES = "";

$errorMessage = "";
$successMessage = "";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get method to show the data of the book

    if (!isset($_GET["BOOK_ID"])) {
        header("location: /cs127_booksTrial/books.php");
        exit;
    }

    $BOOK_ID = $_GET["BOOK_ID"];

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM BOOKS_DATA WHERE BOOK_ID='$BOOK_ID'";
    $result = $conn->query($sql);
    if (!$result) {
        die("Query failed: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    if (!$row) {
        header("location: /cs127_booksTrial/books.php");
        exit;
    }

    $BOOK_TITLE = $row["BOOK_TITLE"];
    $BOOK_YEAR = $row["BOOK_YEAR"];
    $BOOK_PUBLISHER = $row["BOOK_PUBLISHER"];
    $BOOK_COPIES = $row["BOOK_COPIES"];

}
else{
    // Post method to update the data of the book
    $BOOK_ID = $_POST['BOOK_ID'];
    $BOOK_TITLE = $conn->real_escape_string($_POST['BOOK_TITLE']);
    $BOOK_YEAR = $conn->real_escape_string($_POST['BOOK_YEAR']);
    $BOOK_PUBLISHER = $conn->real_escape_string($_POST['BOOK_PUBLISHER']);
    $BOOK_COPIES = $conn->real_escape_string($_POST['BOOK_COPIES']);

    do {
        if (empty($BOOK_ID) || empty($BOOK_TITLE) || empty($BOOK_YEAR) || empty($BOOK_PUBLISHER) || empty($BOOK_COPIES)) {
            $errorMessage = "All the fields are required";
            break;
        }
        // Add new book to the database
        $sql = "UPDATE BOOKS_DATA " .
               "SET BOOK_TITLE='$BOOK_TITLE', BOOK_YEAR='$BOOK_YEAR', BOOK_PUBLISHER='$BOOK_PUBLISHER', BOOK_COPIES='$BOOK_COPIES' " .
               "WHERE BOOK_ID='$BOOK_ID'";
        $result = $conn->query($sql);

        if (!$result) {
            die("Invalid query: " . $conn->error);
        }

        $successMessage = "Book added successfully";

        header("location: /cs127_booksTrial/books.php");
        exit;
    } while (false);
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adding a new Book</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container my-5">
        <h1>New Book</h1>

        <?php
        if (!empty($errorMessage)) {
            echo "
            <div class='alert alert-warning alert-dismissible fade show' role='alert'>
                <strong>$errorMessage</strong>
                <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
            </div>
            ";
        }
        ?>

        <form method="post">
            <input type="hidden" name="BOOK_ID" value="<?php echo $BOOK_ID; ?>">
            <div class="row mb-3">
                <label class="col-sm-3 col-form-label">Book ID</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="BOOK_ID" placeholder="Enter Book ID" value="<?php echo $BOOK_ID; ?>" required>
            </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label">Book Title</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="BOOK_TITLE" placeholder="Enter Book Title" value="<?php echo $BOOK_TITLE; ?>" required>
            </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label">Book Year</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="BOOK_YEAR" placeholder="Enter Book Year" value="<?php echo $BOOK_YEAR; ?>" required>
            </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label">Book Publisher</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="BOOK_PUBLISHER" placeholder="Enter Book Publisher" value="<?php echo $BOOK_PUBLISHER; ?>" required>
            </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label">Book Copies</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="BOOK_COPIES" placeholder="Enter Book Copies" value="<?php echo $BOOK_COPIES; ?>" required>
            </div>

            <?php
            if (!empty($successMessage)) {
                echo "
                <div class='row mb-3'>
                    <div class='offset-sm-3 col-sm-6'>
                        <div class='alert alert-success alert-dismissible fade show' role='alert'>
                            <strong>$successMessage</strong>
                            <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                        </div>
                    </div>
                </div>
                ";
            }
            ?>

            <div class="row mb-3">
                <div class="offset-sm-3 col-sm-3 d-grid">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
                <div class="col-sm-3 d-grid">
                    <a class="btn btn-outline-primary" href="/cs127_booksTrial/books.php" role="button">Cancel</a>
                </div>

            </div>
        </form>
    </div>
</body>
</html>