<?php
/*
Author:             Jerry Orta
Modification Date:  2/11/2011

**** SCOPE ****

  This file assists flash to obtain data from external sources, specifically it serves two purposes:

  1. If needed, to authenticate a proxy server.
  2. Assist flash to overcome domain policy restrictions to obtain external feeds.

**** EXTERNAL FEED SOURCE ****

  The external feed source can be an xml, rss1, rss2, or atam feed.
  For example: url="http://rss.msnbc.msn.com/id/3032071/device/rss/rss.xml"

**** GET VARIABLES ****

  The url to this file should look like the following, which includes proxy authentication:

   http://domain.com/dataService.php?url=http://rss.msnbc.msn.com/id/3032071/device/rss/rss.xml&un=john.doe&pw=password&proxy=proxy.domain.com&port=8080

  In Flash the url request may look like the following:
    var RSS_URL:String = "http://domain.com/dataService.php";
  
    var loader:URLLoader = new URLLoader();
  
    var param:URLVariables = new URLVariables();
        param.url = "http://rss.msnbc.msn.com/id/3032071/device/rss/rss.xml";
        param.auth = "true";
  			param.un = "john.doe";
  			param.pw = "password";
  			param.proxy = 'proxy.domain.com';
  			param.port = 8080;
  			
    var request:URLRequest = new URLRequest(RSS_URL);
        request.method = URLRequestMethod.GET;
  		request.data = param;
  
    loader.addEventListener(Event.COMPLETE, onDataLoad);
    loader.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
  	loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityError);
  
    loader.load(request);
  
    ....
      Error functions
    ....
  
**** AUTHENTICATING A PROXY SERVER. ADDITIONAL PARAMETERS. *****

  Authentication credentials and proxy information is passed to this file from flash, and possibly 
  from another source passed through flash (database, login, etc). In addition 
  to the url of the feed source, five more variables are needed to authenticate
  a proxy server:


  'un':     Username
  'pw':     Password
  'proxy':  Proxy server url --- for example: proxy.domain.com
  'port':   Port to access proxy server --- for example: 8080

  Errors: Flash will give a random io error if this file can not authenticate the proxy server. Unfortunately, that's the only notification 
  you will receive rather than more descriptive authentication failure errors. Know this, deal with this, move on.

**** FLASH'S SAME DOMAIN SECURITY POLICY ****
  Flash requires the target server/feed to grant access permission via a domain policy xml file in it's root directory. 
  Most rss/data services have this by default, but occassionaly some don't. Flash does not need special permission 
  to access any data from the same domain. To overcome the rare occassion that someone forgot to set up a policy
  file, this file acts as a gateway to external feeds for flash. Flash targets this file, which resides in the same domain as
  the flash swf file, and passes this file the intended feed target. This file retrieves the external data, and passes it
  back to flash. Since this file resides in the same domain as the swf, no domain policy restrictions arise. Live Happy.

**** WHY PASS CREDENTIALS AND PROXY INFO INSTEAD OF HARD CODING? ****
  1. Multi-purpose: To allow more general use of this file.
  2. Security: Sensitive information is stored in a secure database, or in a compiled swf (locked from decompiling).

*/

if ($_GET['params']) {
	echo "<p>";
	echo "Sample call url:<br>";
	echo "http://www.domain.com/pathtofile/dataService.php?url=http://rss.msnbc.msn.com/id/3032071/device/rss/rss.xml&un=john.doe&pw=password&proxy=proxy.domain.com&port=8080";
	echo "</p><p>";
	echo "Make sure all values passed are string values. You can send data with the POST method as well.";
	echo "</p>";
}



//username
$rawUsername = ($_POST['un']) ? $_POST['un'] : $_GET['un'];

//Password
$rawPassword = ($_POST['pw']) ? $_POST['pw'] : $_GET['pw'];

//Proxy
$rawProxy = ($_POST['proxy']) ? $_POST['proxy'] : $_GET['proxy'];

//Port
$rawPort = ($_POST['port']) ? $_POST['port'] : $_GET['port'];

$usrpwd = $rawUsername . ":" .  $rawPassword;

$url = ($_POST['url']) ? $_POST['url'] : $_GET['url'];

echo $url;

/*
If no username is provided, don't use proxy authentication, else use proxy authentication
*/
$proxy_auth = ($rawUsername == null) ? false : true;


//Check if HTTP_RAW_POST_DATA is set on server, if not, get from alternate means.
if (!isset($HTTP_RAW_POST_DATA)) {
	$post_data = $HTTP_RAW_POST_DATA = file_get_contents("php://input"); 
} else {
	$post_data = $HTTP_RAW_POST_DATA;
}




$header[] = "Content-type: text/xml"; 
$header[] = "Content-length: " . strlen($post_data);

$session = curl_init( $url );

// If it's a POST, put the POST data in the body
if ($_POST['url']) {
	$postvars = '';
	while ($element = current($_POST)) {
		$postvars .= urlencode(key($_POST)).'='.urlencode($element).'&';
		next($_POST);
	}
	curl_setopt ($session, CURLOPT_POST, true);
	curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
}

//Authenticate proxy credentials
if ($proxy_auth) {
  curl_setopt($session, CURLOPT_PROXY, $proxy); 
  curl_setopt($session, CURLOPT_PROXYPORT, $port);
  curl_setopt($session, CURLOPT_PROXYUSERPWD, $usrpwd);
}

// Don't return HTTP headers. Do return the contents of the call
//curl_setopt($session, CURLOPT_HEADER, false);

curl_setopt($session, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($session, CURLOPT_TIMEOUT, 10); 

// The web service returns XML. Set the Content-Type appropriately
//header("Content-Type: text/xml");
curl_setopt($session, CURLOPT_HTTPHEADER, $header);

/*
//POST DATA SET ABOVE
if ( strlen($post_data)>0 ) { 
  curl_setopt($session, CURLOPT_POSTFIELDS, $post_data); 
}
*/

//Make the call
$response = curl_exec($session);

if (curl_errno($session)) { 
  print curl_error($session); 
} else { 
  curl_close($session); 
	if ($_GET['params'] == null) {
  		echo $response; 
    }
}


?>