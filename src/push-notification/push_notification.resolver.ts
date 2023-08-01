import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import { NotificationDto } from './dto/notification_dto';

const pubSub = new PubSub();

@Resolver()
export class PushNotificationsResolver {

    @Subscription(() => String, {
        resolve: (payload) => payload.newNotification, // Optional: Add a resolver function to extract the notification message from the payload
    })
    newNotification() {
        // This resolver will publish a new notification message when triggered.
        // You can implement the logic to fetch the notification message from your application.
        return pubSub.asyncIterator('newNotification');
    }

    @Mutation(() => String)
    async pushNotificationTest(@Args('notification') notificationMessage: NotificationDto): Promise<String> {
        let notifiDto = new NotificationDto();
        notifiDto.notification_id = uuidv4();
        notifiDto.title = notificationMessage.title;
        notifiDto.message = notificationMessage.message;

        this.triggerNewNotification(JSON.stringify(notifiDto));
        return "Notification pushed!";
    }

    // Method to trigger a new notification from other parts of your application
    triggerNewNotification(notificationMessage: string) {
        pubSub.publish('newNotification', { newNotification: notificationMessage });
        return true; // Return a valid value to avoid null
    }
}
