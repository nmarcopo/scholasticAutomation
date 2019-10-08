// Global Variables
var admin_email='nmarcopo@nd.edu';
var col_name = 'Photography/Event Notes';

/**
triggerOnEdit

Checks to see if the `col_name` column is modified.
If it is, add the change to the `UserProperties`, in property `changes`.

@param {Event} e The onOpen event.
*/
function triggerOnEdit(e)
{
  var range = e.range;
  value = "";
  
  // Don't send an email if I made the change
  if(e.user.getEmail() === admin_email){
    return;
  }
  
  try{
    if(SpreadsheetApp.getActiveSheet().getRange(1, range.getColumn()).getValue() === col_name){
      value = range.getValue();
      changes = PropertiesService.getUserProperties().getProperty('changes')
      if(changes === null){
        changes = ""
      }
      console.log(changes)
      changes += '"' + e.oldValue + '" has been changed to "' + value + '" by ' + e.user + '.\n'
      PropertiesService.getUserProperties().setProperty('changes', changes)
      console.log(changes)
    }
  }catch(e){
    console.error(e)
  }
}

/**
sendEmail

Sends an email to `admin_email` with the contents of `UserProperties` property `changes`.
*/
function sendEmail()
{
  var changes = PropertiesService.getUserProperties().getProperty('changes')
  console.log(changes)
  if(changes !== null){
    MailApp.sendEmail(admin_email,'CHECK THE PHOTO SPREADSHEET!', 
                      'The following changes have been made to the photo spreadsheet:\n' + changes + 
                      '\nThe photo spreadsheet is located here: '+ SpreadsheetApp.getActiveSpreadsheet().getUrl() +'. ');
    PropertiesService.getUserProperties().deleteProperty('changes')
  }
}

/**
createTrigger

Creates a trigger to send an email, if necessary, every minute.
*/
function createTrigger(){
  ScriptApp.newTrigger('sendEmail').timeBased().everyMinutes(1).create()
}
