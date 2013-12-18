//Google App-script
// 

function initialize()
{
  ScriptProperties.setProperty('mailBook','{}');
}

function mailEntry(recepient)
{
  var obj = {};
  
  obj.recepient = recepient;
  obj.status = false;
  obj.timeSent = new Date();
  obj.timeRead = [];
  obj.count = 0;
  
  return obj;
}

function sendEmail(){

var url = 'http://nodeimagetracker.cloudapp.net/reqImage';
var res = UrlFetchApp.fetch(url);
Logger.log(res.getContentText());
  
var uid = res.getContentText();  
  
var recepient = 'abc@xyz.com';
// embed tracker image  
var html = '<img width="1" height="1" src="http://nodeimagetracker.cloudapp.net/' + uid + '"/>';
  
var mailBook = JSON.parse(ScriptProperties.getProperty('mailBook'));  
mailBook[uid] = mailEntry(recepient);
ScriptProperties.setProperty('mailBook',JSON.stringify(mailBook));
  
//Send mail 
GmailApp.sendEmail(recepient,'tracker image', "",{htmlBody:html}); 

//when the recepient opens the mail, img request is sent to the node server.
//The server marks the corresponding uid status as read.

};

//serves general requests for the current read status of emails.
function doGet()
{
  var url = 'http://nodeimagetracker.cloudapp.net/';
  var resObj = JSON.parse(UrlFetchApp.fetch(url));
  updateMailBook(resObj);
  
  return ContentService.createTextOutput(ScriptProperties.getProperty('mailBook'));
}

function updateMailBook(updates)
{
  //Logger.log(ScriptProperties.getProperty('mailBook'));
  //Logger.log(JSON.stringify(updates));
  
  var mailBook = JSON.parse(ScriptProperties.getProperty('mailBook'));  
  
  for (uid in updates)
  {
    if(mailBook[uid])
      if(updates[uid] && updates[uid].status)
      {
        mailBook[uid].status = updates[uid].status;    
        mailBook[uid].timeRead = updates[uid].timeRead;    
        mailBook[uid].count = updates[uid].count;    
      }
  }
  
  ScriptProperties.setProperty('mailBook',JSON.stringify(mailBook));
}