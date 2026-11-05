package com.telecom.classifier.api;

import com.telecom.classifier.api.dto.ClassificationResult;
import com.telecom.classifier.api.dto.ConversationInput;
import com.telecom.classifier.service.ClassifierService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    private final ClassifierService classifierService;

    public ConversationController(ClassifierService classifierService) {
        this.classifierService = classifierService;
    }

    @PostMapping("/classify")
    public ClassificationResult classify(@Valid @RequestBody ConversationInput input) {
        return classifierService.classify(input.message());
    }
}
