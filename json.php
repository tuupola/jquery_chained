<?php

$response[""] = "--";

if ($_GET["mark-remote"]) {
    if ("bmw" == $_GET["mark-remote"]) {
        $response[""] = "--";
        $response["series-1"] = "1 series";
        $response["series-3"] = "3 series";
        $response["series-5"] = "5 series";
        $response["series-6"] = "6 series";
        $response["series-7"] = "7 series";
    };

    if ("audi" == $_GET["mark-remote"]) {
        $response[""] = "--";
        $response["a1"]  = "A1";
        $response["a3"]  = "A3";
        $response["s3"]  = "S3";
        $response["a4"]  = "A4";
        $response["s4"]  = "S4";
        $response["a5"]  = "A5";
        $response["s5"]  = "S5";
        $response["a6"]  = "A6";
        $response["s6"]  = "S6";
        $response["rs6"] = "RS6";
        $response["a8"]  = "A8";
    };   
};

if ($_GET["series-remote"]) {
    if ("series-1" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["3-doors"] = "3 doors";
        $response["5-doors"] = "5 doors";
        $response["coupe"]   = "Coupe";
        $response["cabrio"]  = "Cabrio";
        $response["selected"] = "coupe";
    };

    if ("series-3" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["coupe"]   = "Coupe";
        $response["cabrio"]  = "Cabrio";
        $response["sedan"]   = "Sedan";
        $response["touring"] = "Touring";
    };
    
    if ("series-5" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]   = "Sedan";
        $response["touring"] = "Touring";
        $response["gran-tourismo"] = "Gran Tourismo";
    };

    if ("series-6" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["coupe"]   = "Coupe";
        $response["cabrio"]  = "Cabrio";
    };

    if ("series-7" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]   = "Sedan";
    };
    
    if ("a1" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]   = "Sedan";
    };

    if ("a3" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["sportback"] = "Sportback";
        $response["cabriolet"] = "Cabriolet";
    };
    
    if ("s3" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["sportback"] = "Sportback";
    };

    if ("a4" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["avant"]     = "Avant";
        $response["allroad"]   = "Allroad";
    };

    if ("s4" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
    };

    if ("a5" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sportback"] = "Sportback";
        $response["cabriolet"] = "Cabriolet";
        $response["coupe"]     = "Coupe";
    };

    if ("s5" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sportback"] = "Sportback";
        $response["cabriolet"] = "Cabriolet";
        $response["coupe"]     = "Coupe";
    };
    
    if ("a6" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["avant"]     = "Avant";
        $response["allroad"]   = "Allroad";
    };
    
    if ("s6" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["avant"]     = "Avant";
    };
    
    if ("rs6" == $_GET["series-remote"]) {
        $response[""] = "--";
        $response["sedan"]     = "Sedan";
        $response["avant"]     = "Avant";
    };
    
};

if ($_GET["a-remote"]) { 
    if ("a1" == $_GET["a-remote"]) {
        $response[""]     = "--";
        $response["a1"] = "anything starting a1";
        if ("b1" == $_GET["b-remote"]) {
            $response["a1b1"] = "a1b1";
            $response["a1b1_a1b2"] = "a1b1 or a1b2";
        }
        if ("b2" == $_GET["b-remote"]) {
            $response["a1b1_a1b2"] = "a1b1 or a1b2";
        }
    };

    if ("a2" == $_GET["a-remote"]) {
        $response[""] = "--";
        if ("b2" == $_GET["b-remote"]) {
            $response["a2b2"] = "a2b2";
        }
        if ("b3" == $_GET["b-remote"]) {
            $response["a2b3"] = "a2b3";
        }
    };

    if ("a3" == $_GET["a-remote"]) {
        $response[""] = "--";
    };
}

print json_encode($response);