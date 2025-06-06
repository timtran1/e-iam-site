<?php
require_once __DIR__ . '/myfunctions.inc.php';

use Laminas\Mail\Transport\SmtpOptions;

// E-mail address applied as standard FROM-address and system message recipient. THIS E-MAIL ADDRESS MUST HAVE THE SAME DOMAIN AS THE WEBSITE AT HAND AND IT MUST EXIST! Recommendation: noreply@domainofwebsite
   $mymail='me@example.com';

// Database connection parameters;
   $host= 'eiam-db'; // If your DB server is not running on localhost, enter its address;
   $username = 'eiam';
   $password = 'eiam';
   $db = 'eiam';

// Backup related settings
   $backup_compress = true;  // compress database dump files (only works if zlib extension is availalbe)
   $backup_send_mail = true; // should the above dumps additionally be sent by mail to logged in user?

// Quote handling. If you get results in the form of Peter\'s instead of Peter's, switch this option to 'on';
   $quotehandling='off';

// If your site offers different protocols and or domains (e.g. http://xy.com  https://xy.com  http://www.xy.com  https://www.xy.com), indicate your preferred one (Google likes this!)
   $canonicalprotocolanddomain='';

// E-mail transport via SMTP ('no' or 'yes')? Some providers demand 'yes', sometimes even TO or FROM must be registered with the respective domain (concerns $mymail on line 3 of this file);
   $usesmtp='no';
   //If NO encryption, remove all this: 'ssl' => 'tsl', (adjust port assignment or also remove if standard);
   //If NO authentication, set connection_class to smtp and remove username/password lines
   $mysmtpoptions = new SmtpOptions([
       'name' => 'type_your_web_server_FQDN_here',
       'host' => 'type_your_smtp_server_FQDN_here',
       'port' => 587,
       'connection_class' => 'login',
       'connection_config' => [
           'ssl'      => 'tls',
           'username' => 'type_your_smtp_username_here',
           'password' => 'type_your_smtp_password_here',
       ],
   ]);

// Passwords are sent by zendmail. Set $doublepasswordmailing='yes' to send a duplicate by phpmail (recommended). Note: Other data (coming from your html forms) is always sent by zendmail;
   $doublepasswordmailing='yes';

// $serialmailmethod=0 means serialmails are sent at once. Values above 0 mean "send n mails per call of mailingcron.php". This is necessary if your provider is limiting bulk mail.
   $serialmailmethod=0;
   $minimumwaitingbetweenserialmailcroncallinseconds=60; //valid if $serialmailmethod=1 or higher;

// Facebook sharing parameters (for the syntax [s:]content to share[:s]);
   $fbappid=0; // If you don't have a Facebook Application ID, set $fbappid=0 (sharing with $fbappid=0 works, but it even works better if you get a FB App ID);
   $fbfallbackimg='r/logo/logo_en.jpg'; // The fallback image is used if the content to share does not contain an image. E. g: $fbfallbackimg='r/logo/logo_en.jpg'; (the path must start with r/)!

// Automatically downsize large std jpgs during upload in the backend. E. g. $limitjpgsizetobytes=1000000; $resizedlongedgepx=2000; $resamplingquality=70;
   $limitjpgsizetobytes=1000000; // Recommended: $limitjpgsizetobytes=1000000; to switch downsizing off set $limitjpgsizetobytes=0;
   $resizedlongedgepx=2000; // Recommended: $resizedlongedgepx=2000; if $resizedlongedgepx is very large and $limitjpgsizetobytes small you will observe a loop in the u5CMS-backend image-upload-dialogue;
   $resamplingquality=70; // 0-100; recommended: $resamplingquality=70;

// How to handle std jpg-images
   $recalculateonpagejpgs='no'; // 'yes' means on-page-std-jpgs are OTFR (on-the-fly recalculated). Zoomed-out jpgs are always OTFR.
   $recalculateonpagethumbs='yes'; // idem album thumbnails produced by the syntax [::::::::albumname]
   $stdimagequality=80; // What quality recalculated jpg-images shall have (0-100), e. g. $stdimagequality=80;
   $sharptillnfoldmanualzoom=3; // e. g. $sharptillnfoldmanualzoom=3; means that the std on-page jpg-image remains sharp till 3 fold manual zoom (if $recalculateonpagejpgs='yes';)!

// How to preload HTML5 video and audio
   $audiovideopreload='metadata'; //Possible values: $audiovideopreload='none'; $audiovideopreload='metadata'; $audiovideopreload='auto'; chose 'none' if many video/audio files on one page!

// When using the :dat-command (http://yuba.ch/dat) with taking sql query pieces (e. g. LIKE, ORDER BY) from GET parameters, set $showdatcommandsqlerrors='no'; for productive environments.
   $showdatcommandsqlerrors='yes';

// Allow a full WHERE clause in parameter d of the :dat-command (cf. http://yuba.ch/dat)
   $allowfullwhereasdatparameterd='yes';

// If manually typed (really or seemingly) local paths as (http://youroranysite/)r/filename/filename_languagecode.ext shall be ignored on rename or localize set this option to 'yes';
   $ignoremanualfullpaths='no';

// Search engine parameters
   $doesfindpasswordprotectedcontent = 'yes';
   $doesshowpreviewofsuchcontent     = 'no';
   $doeshideintranetcontenttopublic  = 'yes';
   $resulttitlemaxlength             = 60;
   $maxwordsindocumenttitle          = 7;
   $excludedobjecttypesinsearchresults = 'ifavye'; // Exclude these PIDVESA object types from search results; p=pages, i=std images, f=free images, a=albums, d=documents (for download, anything from docx, pdf to zip), v=video & audio, y=youtube, e=external links

// Allow user upload in forms, e. g. $allowuseruploads = 'yes' (the uploaded files are stored in fileversions/useruploads and are password protected);
   $allowuseruploads = 'yes';
   $revealorigfilenames = 'no'; // Set this to 'no' if you use the uploaded files with the [...:dat] command e. g. for review processes

// Allow user Pupload in forms, e. g. $allowuserPuploads = 'yes' (the uploaded files are stored in r/P and are NOT password protected);
   $allowuserPuploads = 'no';

// Merge multiple <br>'s to <p>'s, e. g. $autocreateparagraphs = 'yes';
   $autocreateparagraphs = 'yes';

// Where PHP code shall be executed, e. g. $executephp='onallpages' or $executephp='inarchiveonly' or $executephp='nowhere';
   $executephp = 'onallpages';

// FOR WHICH RESTRICTED AREAS Higher Admin Rights SHALL BE REQUIRED. Higher Admin Rights (HIADRI) MAY BE GRANTED IN PIDVESA's A (Account) -> manage backend users
   $archiveRqHIADRI = 'yes';
   $formdataRqHIADRI = 'yes';
   $manageintranetmembersRqHIADRI = 'yes';
   $cssRqHIADRI = 'yes';
   $backupRqHIADRI = 'yes';
   $definelanguagesRqHIADRI = 'yes';
   $definesizesRqHIADRI = 'yes';
   $fileversionsRqHIADRI = 'yes';
   $definehomepageRqHIADRI = 'yes';
   $definetitelfixumRqHIADRI = 'yes';
   $viewtrxlistRqHIADRI = 'yes';
   $previewinitscrollRqHIADRI = 'yes';
   $viewbackenduserlistRqHIADRI = 'yes';
   $invitebackendusersRqHIADRI = 'yes';
   $deletebackendusersRqHIADRI = 'yes';
   $upgradebackendusersRqHIADRI = 'yes';

// Width of the notes field in formdata2.php e. g. $noteswidth = 333; and number of lines;
   $noteswidth = 333;
   $noteslines = 3;

// Form data edit parameters
   $mfwhereclause = 'status=1'; // Define which status is allowed for the function [mf] in forms e. g. $mfwhereclause = 'status=1';
   $enableformfieldcheckerforedits = 'no'; // Only if not set to 'yes', the generic formdata editor in the backend can be used;

// Fonts used in the backend in textareas, input fields and for special character listings; indicate one ore more remote URL(s) if necessary (e. g. google fonts) as @import string(s). Ending(s): semicolon.
   $cssremoteurlsifnecessary="@import url(//fonts.googleapis.com/css?family=Arimo:400,700,400italic,700italic&subset=latin,cyrillic,latin-ext,vietnamese,greek,greek-ext,cyrillic-ext);";
   $cssbackendtextarea="font-family:Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;line-height:20px;font-size:12px;";
   $cssbackendinput="font-family:'Arimo', sans-serif";
   $cssbackendspecialchars="font-family:'Arimo', sans-serif;";
   $cssbackendnormaltext="font-family:'Segoe UI', 'Arimo', sans-serif;";

// In the editor, prospective save conflicts can be automatically monitored; set $monitorprospectivesaveconflictseverynseconds=0; to switch off;
   $monitorprospectivesaveconflictseverynseconds=10;

// In the editor's dropdown menu archived pages are hidden by default if the PIDVESA-context is not the archive itself;
   $hidearchivedpagesindropdown='yes';

// Protocol and address to your site, usually you should not change this line! Change to https:// if your site is https-only or if you force https ($forcehttpsonfrontend='yes'; and $forcehttpsonbackend='yes';)!
   $scripturi='http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
   $forcehttpsonfrontend='no';
   $forcehttpsonbackend='no';
   $evaluateifhttpsisinuse='if (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"]!=="off") $httpsisinuse=true;'; // For some providers/servers, the condition (the $_SERVER-variables/their values) have to be different, please consult https://urltoyouru5cmsinstallation/server.php. However, the then-part $httpsnotyetinuse=true; must not be changed!
   $searchforthisinhttpsurl=''; // Empty if http-requesturi==https-requesturi ($searchforthisinhttpsurl='';). E. g. 'https://www.maarsen.ch' (if you mention the protocol in the search string, it is already https!)
   $replacewiththisinhttpsurl=''; // Idem. E. g. 'https://secure.maarsen.ch'. The search-replace-parameters are necessary if your provider offers https only as subdomain (as shown in the e.g.'s);

// Login configuration
   $usesessioninsteadofbasicauth = 'yes'; // $usesessioninsteadofbasicauth = 'yes'; is recommended. However, basic auth may be necessary if you offer very large files behind the login (intranet).
   $sessioncookiehashsalt = '1234'; // Any string. Changing this string cancels all open sessions and forces all users to log-in again; (obsolete if $usesessioninsteadofbasicauth = 'no';)
   $sticksessiontoip = 'no'; // $sticksessiontoip='yes' forces re-login if ip changes (obsolete if $usesessioninsteadofbasicauth = 'no';)
   $minutestowaitaftertoomanyloginattempts=7; // Works only if $usesessioninsteadofbasicauth = 'yes';
   $allowedloginattemptsbeforepausing=7; // Works only if $usesessioninsteadofbasicauth = 'yes';

////// ****** ONLY IF YOU SET $usesessioninsteadofbasicauth = 'no', THE BELOW PARAGRAPH IS OF INTEREST  ******
// If php is installed as cgi and not as module, http basic auth (i. e. the logins) won't work. Solution: switch this option to 'yes' and activate the file fastcgi.htaccess in the cms's top directory by renaming it to .htaccess (the first character MUST be a period!);
// For more info see http://www.besthostratings.com/articles/http-auth-php-cgi.html
   $autoresolvefastcgiproblems='no';
   $basicauthvarname='HTTP_AUTHORIZATION'; // Some servers want $basicauthvarname='REDIRECT_HTTP_AUTHORIZATION'; here, consult https://urltoyouru5cmsinstallation/server.php
   //You may set the realm with this variable (infos see http://yuba.ch/realm):  $u5cmsrealm='anystring';

////// ****** ONLY IF YOU SET $usesessioninsteadofbasicauth = 'no', THE ABOVE PARAGRAPH IS OF INTEREST  ******

// What variable for IP control and logging shall be used; consult http://urltoyouru5cmsinstallation/server.php
   if (key_exists('HTTP_X_ORIGINAL_FORWARDED_FOR', $_SERVER)) {
     $shxofwfL=explode(',',($_SERVER['HTTP_X_ORIGINAL_FORWARDED_FOR'].','));
     $shxofwfL=trim($shxofwfL[count($shxofwfL)-2]);
     if(filter_var($shxofwfL, FILTER_VALIDATE_IP))$_SERVER['REMOTE_ADDR']=$shxofwfL;
   }

// Newly added configuration that were only discussed in the doucmentation
   $orderingintranetpasswordsisforbidden='no';
   $waitsecondsbetweenintranetpworders=600;
   $u5showlinkofactivelanguageinmetanavi='no';
   $oneverysaveupdateindexandhtaccesscostly='no';

// If your config.php is incomplete or messed up, get its initial structure and values at https://yuba.ch/cp

// For SAML-Integration see https://yuba.ch/saml

// Allowed file extensions for http uploads in the front and the back end are configured in configallowedfileextensions.php