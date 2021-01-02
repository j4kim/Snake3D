<?php
    require_once('db_login.php');
    
    // allow CORS request
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: true ");
    header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
    header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
    
    $name = $_POST["name"];
    $score = $_POST["score"];
	
	try{
		$req = $conn->prepare("INSERT INTO `snake3d-scores` (`name`, `score`) VALUES (:name, :score)");
		$result = $req->execute([
			":name" => $name, 
            ":score" => $score
		]);
		if($result)
			echo "score enregistré";
		else
			echo $req->errorInfo();
	}catch (Exception $e){
		echo($e);
	}	
?>