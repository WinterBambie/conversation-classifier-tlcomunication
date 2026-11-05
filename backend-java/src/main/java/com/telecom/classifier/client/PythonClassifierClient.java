package com.telecom.classifier.client;

import com.telecom.classifier.api.dto.ClassificationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PythonClassifierClient {
    private final RestClient restClient;

    public PythonClassifierClient(
            @Value("${classifier.python-api-url:http://localhost:8000}") String baseUrl
    ) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public ClassificationResult classify(String message) {
        return restClient.post()
                .uri("/predict")
                .body(new PythonClassifierRequest(message))
                .retrieve()
                .body(ClassificationResult.class);
    }

    private record PythonClassifierRequest(String message) {
    }
}
