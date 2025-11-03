<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Current Loans</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container my-5">
        <h1>List of Current Loan</h1>
        <a class="btn btn-primary" href="/cs127_booksTrial/createCurrentLoan.php" role="button">New Loan</a>
        <br>

        <table class = "table">
            <thead>
                <th>Transaction ID</th>
                <th>Book ID</th>
                <th>Borrower ID</th>
                <th>Staff ID</th>
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

                    $sql = "SELECT * FROM current_loan";
                    $result = $conn->query($sql);
                    if (!$result) {
                        die("Query failed: " . $conn->error);
                    }

                    while ($row = $result->fetch_assoc()) {
                        echo "
                        <tr>
                            <td>$row[TRANSACTION_ID]</td>
                            <td>$row[BOOK_ID]</td>
                            <td>$row[BORROWER_ID]</td>
                            <td>$row[STAFF_ID]</td>
                            <td>
                                <a class='btn btn-primary' href='/cs127_booksTrial/edit.php?TRANSACTION_ID=$row[TRANSACTION_ID]'>Edit</a>
                                <a class='btn btn-danger' href='/cs127_booksTrial/delete.php?TRANSACTION_ID=$row[TRANSACTION_ID]'>Delete</a> 
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