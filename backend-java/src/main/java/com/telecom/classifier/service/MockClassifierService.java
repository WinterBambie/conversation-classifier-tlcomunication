package com.telecom.classifier.service;

import com.telecom.classifier.api.dto.ClassificationResult;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@ConditionalOnProperty(name = "classifier.provider", havingValue = "mock", matchIfMissing = true)
public class   MockClassifierService implements ClassifierService {
    private static final String MOCK_NOTICE =
            "Deterministic keyword demo only — this is not a trained ML model.";

    @Override
    public ClassificationResult classify(String message) {
        String normalizedMessage = message.toLowerCase(Locale.ROOT);

        if (containsAny(normalizedMessage, "port out", "transfer my number", "move my number")) {
            return matched("Port Out", 0.82);
        }
        if (containsAny(normalizedMessage, "roaming", "travel plan", "international travel")) {
            return matched("Roaming Plans", 0.82);
        }
        if (containsAny(normalizedMessage, "poor signal", "no signal", "dropped call",
                "connectivity", "slow internet", "network issue")) {
            return matched("Poor Connectivity", 0.82);
        }
        if (containsAny(normalizedMessage, "high bill", "bill is high", "overcharged",
                "unexpected charge", "expensive bill")) {
            return matched("High Bill", 0.82);
        }
        if (containsAny(normalizedMessage, "data usage", "data limit", "data allowance",
                "data ran out", "data cap")) {
            return matched("Data Usage", 0.82);
        }
        if (containsAny(normalizedMessage, "add a line", "new line", "additional line",
                "another line")) {
            return matched("Add New Line", 0.82);
        }
        if (containsAny(normalizedMessage, "change my plan", "change plan", "upgrade plan",
                "downgrade plan", "switch plan")) {
            return matched("Change Plans", 0.82);
        }
        if (containsAny(normalizedMessage, "deactivate", "turn off my account")) {
            return matched("Deactivate", 0.82);
        }
        if (containsAny(normalizedMessage, "cancel service", "cancel my service",
                "cancel my account", "end my service")) {
            return matched("Cancel Service", 0.82);
        }

        return new ClassificationResult(
                "Others",
                0.50,
                "Review required",
                "MOCK",
                MOCK_NOTICE
        );
    }

    private ClassificationResult matched(String category, double confidence) {
        return new ClassificationResult(
                category,
                confidence,
                "Review required",
                "MOCK",
                MOCK_NOTICE
        );
    }

    private boolean containsAny(String message, String... phrases) {
        for (String phrase : phrases) {
            if (message.contains(phrase)) {
                return true;
            }
        }
        return false;
    }
}
