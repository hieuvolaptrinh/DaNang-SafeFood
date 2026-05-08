# Requirements Document

## Introduction

This document specifies the requirements for integrating Swagger/OpenAPI documentation into the Spring Boot API. The feature will enable developers and API consumers to view, understand, and test API endpoints through an interactive web interface. The system currently has the springdoc-openapi-starter-webmvc-ui dependency but lacks proper configuration and version specification.

## Glossary

- **Swagger_UI**: The interactive web interface that displays API documentation and allows endpoint testing
- **OpenAPI_Specification**: A standard format for describing RESTful APIs
- **API_Documentation**: Machine-readable and human-readable descriptions of API endpoints, parameters, responses, and schemas
- **Springdoc**: The library that generates OpenAPI documentation from Spring Boot applications
- **Security_Configuration**: Spring Security settings that control access to endpoints
- **Maven_Dependency**: A library declared in pom.xml that the project depends on
- **API_Endpoint**: A specific URL path and HTTP method combination that the API exposes
- **DTO**: Data Transfer Object - classes used for request and response payloads
- **Controller**: Spring MVC component that handles HTTP requests

## Requirements

### Requirement 1: Configure Springdoc OpenAPI Dependency

**User Story:** As a developer, I want the springdoc-openapi dependency properly configured with a version, so that the application can generate OpenAPI documentation.

#### Acceptance Criteria

1. THE Maven_Dependency SHALL specify version 2.7.0 for springdoc-openapi-starter-webmvc-ui
2. WHEN the application starts, THE Springdoc SHALL initialize without errors
3. THE Maven_Dependency SHALL be compatible with Spring Boot 4.0.5 and Java 17

### Requirement 2: Enable Swagger UI Access

**User Story:** As a developer, I want to access Swagger UI through a web browser, so that I can view and test API endpoints interactively.

#### Acceptance Criteria

1. WHEN the application is running, THE Swagger_UI SHALL be accessible at /swagger-ui.html
2. WHEN the application is running, THE Swagger_UI SHALL be accessible at /swagger-ui/index.html
3. THE Swagger_UI SHALL display all public API endpoints from the Controller classes
4. THE Swagger_UI SHALL provide an interactive interface for testing endpoints

### Requirement 3: Configure OpenAPI Documentation Path

**User Story:** As an API consumer, I want to access the raw OpenAPI specification, so that I can generate client code or import into API tools.

#### Acceptance Criteria

1. WHEN the application is running, THE OpenAPI_Specification SHALL be accessible at /v3/api-docs
2. THE OpenAPI_Specification SHALL be in JSON format by default
3. WHERE YAML format is requested, THE OpenAPI_Specification SHALL be accessible at /v3/api-docs.yaml
4. THE OpenAPI_Specification SHALL include all API endpoints, request/response schemas, and security requirements

### Requirement 4: Configure Security Bypass for Documentation Endpoints

**User Story:** As a developer, I want Swagger UI and OpenAPI endpoints to be accessible without authentication, so that I can view documentation during development.

#### Acceptance Criteria

1. THE Security_Configuration SHALL permit unauthenticated access to /swagger-ui/\*\*
2. THE Security_Configuration SHALL permit unauthenticated access to /v3/api-docs/\*\*
3. THE Security_Configuration SHALL permit unauthenticated access to /swagger-ui.html
4. WHEN accessing documentation endpoints, THE Security_Configuration SHALL NOT require JWT authentication
5. THE Security_Configuration SHALL maintain authentication requirements for all other API_Endpoint paths

### Requirement 5: Configure API Metadata

**User Story:** As an API consumer, I want to see descriptive metadata about the API, so that I understand its purpose and version.

#### Acceptance Criteria

1. THE API_Documentation SHALL display title "Da Nang Safe Food API"
2. THE API_Documentation SHALL display version "1.0.0"
3. THE API_Documentation SHALL display description "API for managing food safety in Da Nang city"
4. WHERE contact information is configured, THE API_Documentation SHALL display developer contact details

### Requirement 6: Document API Endpoints with Annotations

**User Story:** As a developer, I want API endpoints to be automatically documented, so that consumers understand how to use them without manual documentation.

#### Acceptance Criteria

1. THE Springdoc SHALL automatically discover all Controller classes
2. THE Springdoc SHALL generate documentation for all public methods annotated with @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, or @PatchMapping
3. THE API_Documentation SHALL include HTTP method, path, parameters, request body schema, and response schema for each API_Endpoint
4. THE API_Documentation SHALL include DTO class properties as schema definitions

### Requirement 7: Document Security Requirements

**User Story:** As an API consumer, I want to see which endpoints require authentication, so that I know when to provide credentials.

#### Acceptance Criteria

1. WHERE an API_Endpoint requires JWT authentication, THE API_Documentation SHALL indicate Bearer token security requirement
2. THE Swagger_UI SHALL provide an "Authorize" button for entering JWT tokens
3. WHEN a JWT token is entered, THE Swagger_UI SHALL include it in subsequent test requests
4. THE API_Documentation SHALL distinguish between authenticated and public endpoints

### Requirement 8: Configure Application Properties

**User Story:** As a developer, I want to configure Swagger behavior through application.yaml, so that I can customize documentation settings without code changes.

#### Acceptance Criteria

1. THE application.yaml SHALL include springdoc.api-docs.path configuration
2. THE application.yaml SHALL include springdoc.swagger-ui.path configuration
3. WHERE springdoc.swagger-ui.enabled is set to false, THE Swagger_UI SHALL be disabled
4. THE application.yaml SHALL support configuring API metadata through springdoc properties

### Requirement 9: Validate Documentation Completeness

**User Story:** As a developer, I want to verify that all endpoints are documented, so that no API functionality is hidden from consumers.

#### Acceptance Criteria

1. WHEN viewing the Swagger_UI, THE API_Documentation SHALL include endpoints from all Controller packages (admin, common, LanhDaoVSATTP)
2. THE API_Documentation SHALL include authentication endpoints
3. THE API_Documentation SHALL include business logic endpoints for CoSoKinhDoanh, PhanAnh, QuyDinh, ThanhTra, ThongBao, and XuPhat
4. WHERE an API_Endpoint is missing from documentation, THE Springdoc SHALL log a warning during application startup

### Requirement 10: Support Development and Production Modes

**User Story:** As a DevOps engineer, I want to disable Swagger UI in production, so that internal API details are not exposed publicly.

#### Acceptance Criteria

1. WHERE springdoc.swagger-ui.enabled is false, THE Swagger_UI SHALL return HTTP 404
2. WHERE springdoc.api-docs.enabled is false, THE OpenAPI_Specification endpoints SHALL return HTTP 404
3. THE application.yaml SHALL support profile-specific configuration for enabling/disabling documentation
4. WHEN running in production profile, THE Security_Configuration SHALL block access to documentation endpoints by default
