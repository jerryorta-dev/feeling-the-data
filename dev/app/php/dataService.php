<?php

header('Access-Control-Allow-Origin: *');


//Use this!
function Parse ($url) {
  $fp = file_get_contents($url);
if ($fp) {
  $json = simplexml_load_string($fp);
 } else {
  echo "could not fopen";
}

  return json_encode($json);
}

//username
$zws-id = $_GET['zws-id'];

//Password
$state = $_GET['state'];

//Proxy
$childtype = $_GET['childtype'];


$url = 'http://www.zillow.com/webservice/GetRegionChildren.htm?' . 'zws-id=' . $_GET['zws-id'] . '&state=' . $_GET['state'] . '&childtype=' . $_GET['childtype'];

echo $url;

$json = Parse($url);

print_r($json);
echo $json;


?>
