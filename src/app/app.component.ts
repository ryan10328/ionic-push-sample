import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';

import { StatusBar, Splashscreen, Push } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { PushService } from '../providers/push-service';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any = HelloIonicPage;
    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public alert: AlertController,
        public pushService: PushService
    ) {
        this.initializeApp();

        // set our app's pages
        this.pages = [
            { title: 'Hello Ionic', component: HelloIonicPage },
            { title: 'My First List', component: ListPage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            let push = Push.init({
                android: {
                    senderID: '[寄件者ID]'
                },
                ios: {
                    alert: true,
                    badge: true,
                    sound: true
                },
                windows: {}
            });

            push.on('registration', (data) => {
                console.log(data.registrationId);
                this.pushService.CreateRegistrationId(data.registrationId).subscribe(
                    (pushHubId) => {
                        this.pushService.UpdateRegistration(data.registrationId, pushHubId)
                            .subscribe();
                    });
            });

            push.on('notification', (data) => {
                let _alert = this.alert.create({
                    title: data.title,
                    message: data.message,
                    buttons: ['OK']
                });

                _alert.present();
            });

            push.on('error', (e) => {
                console.log(e.message);
            });

        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}
