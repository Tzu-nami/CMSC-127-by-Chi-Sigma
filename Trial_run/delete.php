<?php
if( isset($_GET['BOOK_ID']) ) {
    $BOOK_ID = $_GET['BOOK_ID'];

    // Database connection parameters
    $servername = 'localhost';
    $user = 'root';
    $pass = '';
    $database = 'cs127_books';

    // Create connection
    $conn = new mysqli($servername, $user, $pass, $database);

    $sql = "DELETE FROM BOOKS_DATA WHERE BOOK_ID='$BOOK_ID'";
    $conn->query($sql);
}
$conn->close();
header("location: /cs127_booksTrial/books.php");
exit;
?>