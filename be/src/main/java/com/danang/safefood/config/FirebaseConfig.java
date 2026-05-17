package com.danang.safefood.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.credentials-location:classpath:danangsafefood-firebase-adminsdk.json}")
    private Resource credentialsResource;

    @PostConstruct
    public void init() throws IOException {
        if (!credentialsResource.exists()) {
            log.warn("Firebase credentials not found at {}. Firebase messaging will be disabled.",
                    credentialsResource);
            return;
        }

        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("FirebaseApp already initialized. Skipping duplicate initialization.");
            return;
        }

        try (InputStream serviceAccount = credentialsResource.getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("FirebaseApp initialized successfully.");
        }
    }
}
