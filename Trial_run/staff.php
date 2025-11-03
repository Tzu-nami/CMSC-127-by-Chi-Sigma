<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container my-5">
        <h1>List of Staff</h1>
        <a class="btn btn-primary" href="/cs127_booksTrial/createStaff.php" role="button">New Staff</a>
        <br>

        <table class = "table">
            <thead>
                <th>Staff ID</th>
                <th>Staff Last Name</th>
                <th>Staff First Name</th>
                <th>Staff Middle Initial</th>
                <th>Staff Job</th>
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

                    $sql = "SELECT * FROM STAFF_DATA";
                    $result = $conn->query($sql);
                    if (!$result) {
                        die("Query failed: " . $conn->error);
                    }

                    while ($row = $result->fetch_assoc()) {
                        echo "
                        <tr>
                            <td>$row[STAFF_ID]</td>
                            <td>$row[STAFF_LASTNAME]</td>
                            <td>$row[STAFF_FIRSTNAME]</td>
                            <td>$row[STAFF_MIDDLEINITIAL]</td>
                            <td>$row[STAFF_JOB]</td>
                            <td> 
                                <a class='btn btn-primary' href='/cs127_booksTrial/edit.php?STAFF_ID=$row[STAFF_ID]'>Edit</a>
                                <a class='btn btn-danger' href='/cs127_booksTrial/delete.php?STAFF_ID=$row[STAFF_ID]'>Delete</a> 
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