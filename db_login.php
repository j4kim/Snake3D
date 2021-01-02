<?php

$DB_host = "localhost";
$DB_user = "j4kim";
$DB_pass = "secret";
$DB_name = "j4kim";

try {
    $conn = new PDO('mysql:host='.$DB_host.';dbname='.$DB_name, $DB_user, $DB_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "Erreur !: " . $e->getMessage() . "<br/>";
    die();
}
?>