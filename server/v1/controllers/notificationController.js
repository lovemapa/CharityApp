var FCM = require('fcm-node');
let server2 = 'AIzaSyDNEF5K8ln7ogo12Hct4lj_BjXX_DAOnWU'
var fcm = new FCM(server2);
import User from '../../models/user'


import moment from 'moment';

class notiController {


    // sendUserNotification(userId, opponentId, type, msg, data) {
    sendUserNotification(userId, opponentId, msg, data, type,name) {

        User.findById(opponentId).then(user => {

            if (user.deviceId) {
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: user.deviceId,
                    notification: {
                        title: 'Like Minded',
                        body:name+' sent you a message '+ msg,
			username:name,
                        body: msg,
                        type: type,
                        notiData: data,
                        date: moment().valueOf()
                    },
                    data: {  //you can send only notification or only data(or include both)
                        title: 'Like Minded',
                        body: name+' sent you a message '+msg,
			username:name,
                        body: msg,
                        type: type,
                        notiData: data,
                        date: moment().valueOf()
                    }
                };

                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log("Something has gone wrong!" + err);
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });
            }
        }).catch(err => console.log('queryerror', err))
    }

}

export default notiController
