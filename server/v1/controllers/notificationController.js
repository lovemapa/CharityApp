var FCM = require('fcm-node');
var serverKey1 = 'AIzaSyDMMlrn_SJpJJEWtffnhywbjlk_W_fd9bQ'; //put your server key here
var serverKey = 'AAAAzWtUPk8:APA91bHkfptLjny4EANT1jS_rRMJSoQnxi53v1yiz8UAzr_kSDK0hP9khlYBR3bj-KR19MzpqxR6STE0ztCel6jiqfx1ecwv-QOEHsTLN7Ji6VamvDLZ82Bx8MwV_Amjsl8I-gSqsVuL'
let server2 = 'AIzaSyDNEF5K8ln7ogo12Hct4lj_BjXX_DAOnWU'
var fcm = new FCM(server2);
import User from '../../models/user'


import moment from 'moment';

class notiController {


    // sendUserNotification(userId, opponentId, type, msg, data) {
    sendUserNotification(userId, opponentId, msg) {


        // if (type != 53) {
        //     let noti = new DriverAlert({
        //         adminId: adminId,
        //         driverId: id,
        //         notiType: type,
        //         message: msg,
        //         date: moment().valueOf()
        //     })
        //     if(userId) noti.userId = userId
        //     noti.save().then({})
        // }
        console.log('userId===', userId);
        console.log('opponentId===', opponentId);
        console.log('msg===', msg);

        User.findById(userId).then(user => {

            if (user.deviceId) {
                if (user.deviceType == 'android') {

                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: user.deviceId,
                        data: {  //you can send only notification or only data(or include both)
                            title: 'Message',
                            body: msg,

                            notiData: data,
                            date: moment().valueOf()
                        }
                    };
                } else {

                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: user.deviceId,
                        notification: {
                            title: 'Tyrell',
                            body: msg,

                            notiData: data,
                            date: moment().valueOf()
                        },
                        data: {  //you can send only notification or only data(or include both)
                            title: 'Tyrell',
                            body: msg,
                            type: type,
                            notiData: data,
                            date: moment().valueOf()
                        }
                    };
                }

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
    sendNotiAdmin(adminId, data, msg, type) {
        Customer.findById(adminId).then((result) => {

            if (result.deviceId) {
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: result.deviceId,
                    data: {  //you can send only notification or only data(or include both)
                        title: 'Tyrell',
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

        }).catch((err) => {
            console.log(err)
        })
    }


    sendUserAdminNoti(adminId, msg) {
        return new Promise((done, reject) => {

            User.find({ status: 1, adminId: adminId }).select("+deviceId").then(users => {

                let Arr = []
                let iosArr = []
                users.map(val => {
                    if (val.deviceId) {
                        if (val.deviceType == 'Android')
                            Arr.push(val.deviceId)
                        else
                            iosArr.push(val.deviceId)
                    }

                })

                if (Arr.length > 0) {

                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        registration_ids: Arr,
                        data: {  //you can send only notification or only data(or include both)
                            title: 'Tyrell',
                            body: msg,
                            type: 10,
                            notiData: {},
                            date: moment().valueOf()
                        }
                    };

                    fcm.send(message, function (err, response) {
                        if (err) {
                            console.log("Something has gone wrong!" + err);
                        } else {
                            console.log("Successfully sent with response: ", response);
                            done('success')
                        }
                    });
                }
                if (iosArr.length > 0) {
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        registration_ids: iosArr,

                        notification: {
                            title: 'Tyrell',
                            body: msg,
                            type: 10,
                            notiData: {},
                            date: moment().valueOf()
                        },

                        data: {  //you can send only notification or only data(or include both)
                            title: 'Tyrell',
                            body: msg,
                            type: 10,
                            notiData: {},
                            date: moment().valueOf()
                        }
                    };

                    fcm.send(message, function (err, response) {
                        if (err) {
                            console.log("Something has gone wrong!" + err);
                        } else {
                            console.log("Successfully sent with response: ", response);
                            done('success')
                        }
                    });
                }
            })
        })
    }

}

export default notiController