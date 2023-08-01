import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NotificationDto {
  @Field({ nullable: true })
  notification_id: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  message: string;
}
