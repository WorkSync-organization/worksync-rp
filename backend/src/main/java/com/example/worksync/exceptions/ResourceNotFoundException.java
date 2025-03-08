package com.example.worksync.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long resourceId) {
        super(String.format("%s with ID %d not found", resourceName, resourceId));
    }
}
