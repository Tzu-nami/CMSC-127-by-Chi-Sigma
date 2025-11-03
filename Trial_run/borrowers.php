<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Borrowers</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container my-5">
        <h1>List of Borrowers</h1>
        <a class="btn btn-primary" href="/cs127_booksTrial/createBorrower.php" role="button">New Borrower</a>
        <br>

        <table class = "table">
            <thead>
                <th>Borrower ID</th>
                <th>Borrower Last Name</th>
                <th>Borrower First Name</th>
                <th>Borrower Middle Initial</th>
                <th>Borrower Status</th>
                <th>Borrower Contact Number</th>
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

                    $sql = "SELECT * FROM BORROWER_DATA";
                    $result = $conn->query($sql);
                    if (!$result) {
                        die("Query failed: " . $conn->error);
                    }

                    while ($row = $result->fetch_assoc()) {
                        echo "
                        <tr>
                            <td>$row[BORROWER_ID]</td>
                            <td>$row[BORROWER_LASTNAME]</td>
                            <td>$row[BORROWER_FIRSTNAME]</td>
                            <td>$row[BORROWER_MIDDLEINITIAL]</td>
                            <td>$row[BORROWER_STATUS]</td>
                            <td>$row[BORROWER_CONTACTNUMBER]</td>
                            <td> 
                                <a class='btn btn-primary' href='/cs127_booksTrial/edit.php?BORROWER_ID=$row[BORROWER_ID]'>Edit</a>
                                <a class='btn btn-danger' href='/cs127_booksTrial/delete.php?BORROWER_ID=$row[BORROWER_ID]'>Delete</a> 
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