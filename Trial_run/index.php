<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Books Database by Chi Sigma</title>
</head>
<body>
    <div class="container">
        <h1>Dashboard</h1>
        <br>
        <table class="table">
            <thead>
                <tr>
                    <th><a href="/cs127_booksTrial/books.php" target="_blank">Books</a></th>
                    <th><a href="/cs127_booksTrial/borrowers.php" target="_blank">Borrowers</a></th>
                    <th><a href="/cs127_booksTrial/staff.php" target="_blank">Staff</a></th>
                    <th><a href="/cs127_booksTrial/currentLoans.php" target="_blank">Current Loans</a></th>
                    <th><a href="/cs127_booksTrial/transactions.php" target="_blank">Transactions</a></th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Database connection parameters
                $servername = 'localhost';
                $user = 'root';
                $pass = '';
                $database = 'cs127_books';

                // Create connection
                $conn = new mysqli($servername, $user, $pass, $database);

                // Check connection
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                // Fetch books data
                $sqlBooks = "SELECT BOOK_TITLE FROM BOOKS_DATA";
                $bookResult = $conn->query($sqlBooks);
                $sqlBorrowers = "SELECT CONCAT(BORROWER_LASTNAME, ', ', BORROWER_FIRSTNAME, ' ', BORROWER_MIDDLEINITIAL) AS FULL_NAME FROM BORROWER_DATA";
                $borrowerResult = $conn->query($sqlBorrowers);
                $sqlStaff = "SELECT CONCAT(STAFF_LASTNAME, ', ', STAFF_FIRSTNAME, ' ', STAFF_MIDDLEINITIAL) AS FULL_NAME FROM STAFF_DATA";
                $staffResult = $conn->query($sqlStaff);

                if (!$bookResult) {
                    die("Query failed: " . $conn->error);
                }

                if (!$borrowerResult) {
                    die("Query failed: " . $conn->error);
                }

                if (!$staffResult) {
                    die("Query failed: " . $conn->error);
                }
                // Output data of each row
                while(true) {
                    $bookRow = $bookResult->fetch_assoc();
                    $borrowerRow = $borrowerResult->fetch_assoc();
                    $staffRow = $staffResult->fetch_assoc();

                    // Break the loop if there are no more rows
                    if (!$bookRow && !$borrowerRow) {
                        break;
                }

                $book = $bookRow['BOOK_TITLE'] ?? '';
                $borrower = $borrowerRow['FULL_NAME'] ?? '';
                $staff = $staffRow['FULL_NAME'] ?? '';

                echo "<tr>
                        <td>$book</td>
                        <td>$borrower</td>
                        <td>$staff</td>
                      </tr>";
                }
                

                // Close connection
                $conn->close();
                ?>
            </tbody>

        </table>
    </div>
</body>
</html>