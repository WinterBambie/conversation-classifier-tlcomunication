package com.telecom.classifier.service;

import com.telecom.classifier.api.dto.ClassificationResult;

public interface ClassifierService {
    ClassificationResult classify(String message);
}
