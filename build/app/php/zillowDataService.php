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
//$zwsid = $_GET['zws-id'];

//Password
//$state = $_GET['state'];

//Proxy
//$childtype = $_GET['childtype'];


$url = 'http://www.zillow.com/webservice/GetRegionChildren.htm?' . 'zws-id=' . $_GET['zws-id'] . '&state=' . $_GET['state'] . '&childtype=' . $_GET['childtype'];
//$url = 'http://feelingthedata.com/app/php/zillowDataService.php?zws-id=X1-ZWz1dshk18nnyj_76gmj&state=tx&childtype=zipcode';

//echo $url;

echo Parse($url);

//print_r($json);
//echo $json;


?>
