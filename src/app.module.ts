import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true, // Enable WebSocket subscriptions
      subscriptions: {
        "graphql-ws": true,
        "subscriptions-transport-ws": true
      },
      formatError: (error: GraphQLError & { extensions: { validationErrors?: any } }) => {

        const { extensions } = error;

        if (error.message === 'No token provided!') {
          return {
            message: error.message,
            code: 'UNAUTHORIZED',
            name: 'Unauthorized',
            statusCode: 401,
          };
        }

        if (extensions && extensions.validationErrors) {
          return {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            name: 'ValidationException',
            statusCode: 400,
            validationErrors: extensions.validationErrors,
          };
        }

        if (extensions && extensions.originalError) {
          return {
            message: extensions.originalError['message'],
            code: 'VALIDATION_ERROR',
            name: 'ValidationException',
            statusCode: 400,
            validationErrors: extensions.validationErrors,
          };
        }

        if (extensions && extensions.code === 'UNAUTHORIZED') {
          return {
            message: error.message,
            code: 'UNAUTHORIZED',
            name: 'Unauthorized',
            statusCode: 401,
          };
        }
        const graphQLFormattedError = {
          message: (extensions as { response: { message?: string } }).response?.message || error.message,
          code: (extensions as { response: { code?: string } }).response?.code || 'SERVER_ERROR',
          name: (extensions as { response: { name?: string } }).response?.name || error.name,
          statusCode: (extensions as { response: { statusCode?: number } }).response?.statusCode || 500,
        };
        return graphQLFormattedError;
      },


    }),
    PushNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule { }
