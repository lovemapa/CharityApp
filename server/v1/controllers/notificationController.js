var FCM = require('fcm-node');
var serverKey1 = 'AIzaSyDMMlrn_SJpJJEWtffnhywbjlk_W_fd9bQ'; //put your server key here
var serverKey = 'AAAAzWtUPk8:APA91bHkfptLjny4EANT1jS_rRMJSoQnxi53v1yiz8UAzr_kSDK0hP9khlYBR3bj-KR19MzpqxR6STE0ztCel6jiqfx1ecwv-QOEHsTLN7Ji6VamvDLZ82Bx8MwV_Amjsl8I-gSqsVuL'
let server2 = 'AIzaSyDNEF5K8ln7ogo12Hct4lj_BjXX_DAOnWU'
var fcm = new FCM(server2);
import User from '../../models/user'


import moment from 'moment';

class notiController {


    // sendUserNotification(userId, opponentId, type, msg, data) {
    sendUserNotification(userId, opponentId, msg, data, type) {

        User.findById(opponentId).then(user => {

            if (user.deviceId) {
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: user.deviceId,
                    notification: {
                        title: 'New Message',
                        body: msg,
                        type: type,
                        notiData: data,
                        date: moment().valueOf()
                    },
                    data: {  //you can send only notification or only data(or include both)
                        title: 'New Message',
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