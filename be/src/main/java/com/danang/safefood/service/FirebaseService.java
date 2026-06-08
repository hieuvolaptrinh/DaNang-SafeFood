package com.danang.safefood.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseService {

    @Async
    public void sendToToken(String token, String title, String body) {
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("FirebaseApp is not initialized. Skipping sendToToken.");
            return;
        }

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
            log.error("Failed to send Firebase message to token", e);
        }
    }

    @Async
    public void sendToTopicAsync(String topic, String title, String body) {
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("FirebaseApp is not initialized. Skipping sendToTopicAsync.");
            return;
        }

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
            log.error("Failed to send Firebase message to topic", e);
        }
    }
}
