<?php
	require_once('tools.php');
    
    // allow CORS request
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: true ");
    header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
    header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
    
    $sql = "SELECT * FROM `snake3d-scores` order by score desc limit 100";
    
    echoTable($sql);
?>