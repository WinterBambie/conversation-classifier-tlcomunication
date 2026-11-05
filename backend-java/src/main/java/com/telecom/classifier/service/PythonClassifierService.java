package com.telecom.classifier.service;

import com.telecom.classifier.api.dto.ClassificationResult;
import com.telecom.classifier.client.PythonClassifierClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "classifier.provider", havingValue = "python-api")
public class PythonClassifierService implements ClassifierService {
    private final PythonClassifierClient classifierClient;

    public PythonClassifierService(PythonClassifierClient classifierClient) {
        this.classifierClient = classifierClient;
    }

    @Override
    public ClassificationResult classify(String message) {
        ClassificationResult result = classifierClient.classify(message);
        return new ClassificationResult(
                result.category(),
                result.confidence(),
                result.reviewStatus(),
                "PYTHON_API",
                "Prediction returned by the configured Python classifier API."
        );
    }
}
