import { Module } from '@nestjs/common';
import { PushNotificationsResolver } from './push_notification.resolver';

@Module({
    imports: [],
    providers: [PushNotificationsResolver],
    exports: [],
})
export class PushNotificationModule { }