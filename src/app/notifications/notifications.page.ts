import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  notificationList: any[] = [];
  ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      console.log('Not reg ' + JSON.stringify(result));

      }
    }).catch((error) => {
      console.log('Error on registration: ' + JSON.stringify(error));

    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {

        console.log('Push action performed: ' + JSON.stringify(notification));
        
        this.notificationList.push(notification.notification.data)
      //  {"actionId":"tap","notification":
      // {"id":"0:1747353223582835%1471996a1471996a",
      // "data":{"google.delivered_priority":"high","google.original_priority":"high",
      // "key":"test","from":"719771663506","value":"test2","collapse_key":"com.demonotf.myapp"}}}
      },
    );
  }
backPage() {
  this.navCtrl.navigateBack('dashboard')
}
}
