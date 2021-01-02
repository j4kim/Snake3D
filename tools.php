<?php
    function getRows($sql){
        require_once('db_login.php');
        
        try{
            $response = $conn->query($sql);
    
            $rows = [];
            while($row = $response->fetch(PDO::FETCH_ASSOC)){
                $rows[] = $row;
            }       
            $response->closeCursor();
            return $rows;   
        }
        catch (PDOException $e){
            print($e);
            die();
        }
    }

    function echoJson($sql){
        $rows = getRows($sql);
        echo json_encode($rows);  
    }
    
    function echoTable($sql){
        $rows = getRows($sql);
        $table = "<table>";
        /*
        $table .= "<tr>";
        $table .= "<th>rang</th>";
        foreach ($rows[0] as $key => $value){
            $table .= "<th>$key</th>";
        }
        $table .= "</tr>";
        */
        $i=1;
        foreach ($rows as $line){
            $table .= "<tr>";
            $table .= "<td>$i</td>";
            $i++;
            foreach ($line as $key => $value){
                $table .= "<td>$value</td>";
            }
            $table .= "</tr>";
        }
        $table .= "</table>";
        echo $table;
    }

?>