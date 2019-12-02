'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constant;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var constant = (_constant = {
    TRUE: true,
    FALSE: false,
    TRUEMSG: 'Successful',
    FALSEMSG: 'Please try again later',
    SENTMSG: 'Sent successfully',
    REGISTERMSG: 'Sent successfully',
    INVALIDPARAMS: 'Invalid parameters',
    NOTREGISTERED: 'This email not registered with any account',
    EXISTSMSG: 'associated with another account',
    SOMETHINGWRONG: 'Something went wrong. Please try again later',
    ADDMSG: 'Added successfully',
    UPDATEMSG: 'Updated sucessfully',
    SAVEMSG: 'Saved sucessfully',
    DELETEMSG: 'Deleted sucessfully',
    NOFILEMSG: 'No file selected',
    REGISTERAPP: 'You have successfully registered for this app',
    GROUPCREATESUCCESS: 'Group has been created succesffuly'
}, _defineProperty(_constant, 'EXISTSMSG', 'associated with another account(Account already taken, try another)'), _defineProperty(_constant, 'PARAMSMISSING', 'Parameters Missing'), _defineProperty(_constant, 'CONVOMISSING', 'Conversation ID Missing'), _defineProperty(_constant, 'OPPOMISSING', 'opponent ID Missing'), _defineProperty(_constant, 'MESSAGEDELETE', 'please provide array of message IDs to be deleted'), _defineProperty(_constant, 'PARAMSGROUPMISSING', 'Provide group ID'), _defineProperty(_constant, 'OBJECTIDERROR', 'Provide valid user ObjectIDs'), _defineProperty(_constant, 'PARAMSMISSINGCHATHISTORY', 'Provide both sender and reciever Id'), _defineProperty(_constant, 'PARAMSMISSINGGROUPCHATHISTORY', 'Provide sender Id'), _defineProperty(_constant, 'BLOCKMESSAGE', 'You cannot send mesage.You are blocked by the user'), _defineProperty(_constant, 'ALREADYBLOCKED', 'User is already blocked'), _defineProperty(_constant, 'UNBLOCKED', 'User is unblocked succesfully'), _defineProperty(_constant, 'BLOCKED', 'User is blocked Successfully'), _defineProperty(_constant, 'FILEMISSING', 'Missing File'), _defineProperty(_constant, 'USERIMAGE', 'static/users/'), _defineProperty(_constant, 'MESSAGEMEDIA', 'static/media/'), _defineProperty(_constant, 'BASEURL', 'http://13.232.208.65:9000/'), _constant);

exports.default = constant;