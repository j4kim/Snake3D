<?php

require_once('./config.php');

try {
    $conn = new PDO($CONFIG['dsn'], @$CONFIG['user'], @$CONFIG['pwd']);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "Erreur !: " . $e->getMessage() . "<br/>";
    die();
}
?>