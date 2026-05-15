package com.danang.safefood.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    @Async
    public void sendToToken(String token, String title, String body) {
        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendToTopicAsync(String topic, String title, String body) {
        Message message = Message.builder()
                .setTopic(topic)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
