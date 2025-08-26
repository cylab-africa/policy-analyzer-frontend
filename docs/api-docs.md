# API Documentation

## Overview

This document outlines the data structures, endpoints, and integration patterns for the African Policy & Digital Identity Platform. While the current implementation is primarily frontend-focused with static data, this API specification provides a foundation for future backend integration.

---

## Data Models

### Country Model

```typescript
interface Country {
  // Basic Information
  id: string;                          // Unique identifier (e.g., "KE")
  isoAlpha2: string;                   // ISO 3166-1 alpha-2 code
  isoAlpha3: string;                   // ISO 3166-1 alpha-3 code
  name: string;                        // Official country name
  flagEmoji: string;                   // Unicode flag emoji
  region: Region;                      // Geographic region
  
  // Data Protection Information
  dataProtectionLegislationStatus: LegislationStatus;
  yearLegislationEnacted?: string;     // Year when law was enacted
  malaboConventionStatus: ConventionStatus;
  
  // Contact Information
  dataProtectionAuthority?: string;    // Name of supervising authority
  authorityWebsite?: string;           // Official authority website
  
  // Metadata
  lastUpdated: string;                 // ISO date string
  dataQuality: DataQuality;            // Confidence level in data
}

type Region = 
  | "North Africa" 
  | "West Africa" 
  | "East Africa" 
  | "Central Africa" 
  | "Southern Africa" 
  | "Continental";

type LegislationStatus = 
  | "Enacted" 
  | "Draft" 
  | "No Law" 
  | "Limited" 
  | "Unknown";

type ConventionStatus = 
  | "Signed" 
  | "Ratified" 
  | "Not Signed" 
  | "Unknown";

type DataQuality = 
  | "High"      // Official government source
  | "Medium"    // Verified secondary source  
  | "Low"       // Unverified or outdated
  | "Unknown";  // Needs verification
```

### Digital ID Model

```typescript
interface DigitalIDSystem {
  // Basic Information
  countryCode: string;                 // References Country.isoAlpha2
  systemName: string;                  // e.g., "Huduma Namba"
  status: ImplementationStatus;
  
  // Implementation Details
  implementationYear: string;
  coveragePercentage?: number;         // % of population covered
  issuingAuthority: string;            // Government agency responsible
  
  // Technical Specifications
  biometricCapabilities: BiometricType[];
  features: SystemFeature[];
  
  // Legal Framework
  legalBasis: string[];                // Supporting legislation
  privacyProtections: PrivacyMeasure[];
  
  // Metadata
  lastUpdated: string;
  dataSource: string;                  // Source of information
  verified: boolean;                   // Official verification status
}

type ImplementationStatus = 
  | "Implemented"    // Fully operational
  | "Partial"        // Limited deployment
  | "Planning"       // In development phase
  | "None"          // No Data
  | "Unknown";      // Status unclear

type BiometricType = 
  | "Fingerprint"
  | "Facial Recognition"
  | "Iris Scan"
  | "Voice Recognition"
  | "Digital Signature";

type SystemFeature = 
  | "Birth Registration"
  | "Voter Registration"
  | "Financial Services Access"
  | "Healthcare Integration"
  | "Education Services"
  | "Government Benefits"
  | "Border Control"
  | "Tax Identification";

type PrivacyMeasure = 
  | "Data Encryption"
  | "Access Controls"
  | "Audit Trails"
  | "User Consent"
  | "Data Minimization"
  | "Right to Correction"
  | "Data Portability";
```

### Resource Document Model

```typescript
interface ResourceDocument {
  // Identification
  id: string;                          // Unique document identifier
  title: string;                       // Document title
  description: string;                 // Brief description
  
  // Classification
  documentType: DocumentType;
  resourceCategory: ResourceCategory;
  countryCode: string;                 // References Country.isoAlpha2
  
  // Content Information
  language: Language[];                // Document languages
  fileFormat: FileFormat;              // PDF, DOC, HTML, etc.
  fileSize?: number;                   // Size in bytes
  pageCount?: number;                  // Number of pages
  
  // Access Information
  accessUrl: string;                   // Direct download/view URL
  alternativeUrls?: string[];          // Mirror or backup URLs
  accessLevel: AccessLevel;            // Public, restricted, etc.
  
  // Metadata
  publicationDate: string;             // Original publication date
  lastModified?: string;               // Last modification date
  publisher: string;                   // Publishing organization
  officialSource: boolean;             // Government published
  verified: boolean;                   // Link verified working
  lastVerified: string;                // Last verification date
  
  // Relationships
  relatedDocuments?: string[];         // IDs of related documents
  supersedes?: string;                 // ID of document this replaces
  supersededBy?: string;               // ID of newer version
  
  // Usage Information
  downloadCount?: number;              // Usage statistics
  rating?: number;                     // User rating (1-5)
  tags: string[];                      // Searchable tags
}

type DocumentType = 
  | "Legislation"           // Laws and statutes
  | "Regulation"           // Implementation regulations
  | "Framework"            // Policy frameworks
  | "Guidelines"           // Implementation guidelines
  | "Standard"             // Technical standards
  | "Report"               // Research or assessment reports
  | "Template"             // Document templates
  | "Other";

type ResourceCategory = 
  | "Data Protection"
  | "Digital Identity"
  | "Cybersecurity"
  | "Privacy Rights"
  | "Implementation Guide"
  | "Best Practice"
  | "International Framework";

type Language = 
  | "English"
  | "French" 
  | "Arabic"
  | "Portuguese"
  | "Swahili"
  | "Amharic"
  | "Other";

type FileFormat = 
  | "PDF"
  | "DOC"
  | "DOCX"
  | "HTML"
  | "TXT"
  | "RTF";

type AccessLevel = 
  | "Public"               // Freely accessible
  | "Registration"         // Requires registration
  | "Restricted"           // Limited access
  | "Internal";            // Internal use only
```

### Timeline Event Model

```typescript
interface TimelineEvent {
  // Identification
  id: string;                          // Unique event identifier
  title: string;                       // Event title
  description: string;                 // Detailed description
  
  // Temporal Information
  eventDate: string;                   // ISO date string
  eventYear: number;                   // Year for grouping
  precision: DatePrecision;            // How precise the date is
  
  // Classification
  eventType: EventType;
  significance: SignificanceLevel;
  affectedCountries: string[];         // Country codes
  region?: Region;                     // If regional event
  
  // Content
  summary: string;                     // Brief summary for displays
  impact: string;                      // Description of impact
  context: string;                     // Background context
  
  // Sources and References
  sources: EventSource[];              // Information sources
  relatedDocuments?: string[];         // Related document IDs
  externalLinks?: string[];            // Relevant external links
  
  // Metadata
  verified: boolean;                   // Information verified
  featured: boolean;                   // Highlight in displays
  tags: string[];                      // Searchable tags
  lastUpdated: string;                 // Last modification date
}

type DatePrecision = 
  | "Exact"        // Specific date known
  | "Month"        // Month and year known
  | "Quarter"      // Quarter and year known
  | "Year"         // Only year known
  | "Approximate"; // Estimated timeframe

type EventType = 
  | "Legislation Enacted"      // Law passed
  | "Legislation Proposed"     // Bill introduced
  | "Convention Signed"        // International agreement
  | "Convention Ratified"      // Domestic ratification
  | "System Launched"          // Digital ID system launch
  | "Authority Established"    // Regulatory body created
  | "Framework Published"      // Policy framework released
  | "Amendment Made"           // Law or regulation amended
  | "Court Decision"           // Judicial ruling
  | "International Agreement"  // Bilateral/multilateral agreement
  | "Other";

type SignificanceLevel = 
  | "Continental"     // Africa-wide impact
  | "Regional"        // Regional impact
  | "National"        // Single country impact
  | "Local";          // Sub-national impact

interface EventSource {
  type: SourceType;
  name: string;                        // Source name/publication
  url?: string;                        // Source URL
  date?: string;                       // Publication date
  reliability: ReliabilityLevel;
}

type SourceType = 
  | "Government"       // Official government source
  | "News Media"       // News publication
  | "Academic"         // Academic publication
  | "International Org" // UN, AU, etc.
  | "NGO"             // Non-governmental organization
  | "Legal Database"   // Legal information service
  | "Other";

type ReliabilityLevel = 
  | "High"      // Official or well-verified
  | "Medium"    // Reputable secondary source
  | "Low"       // Unverified or questionable
  | "Unknown";  // Reliability not assessed
```

### Chat Conversation Model

```typescript
interface ChatConversation {
  // Identification
  id: string;                          // Unique conversation ID
  sessionId: string;                   // Browser session ID
  
  // Context
  chatType: ChatType;                  // Data Protection or Digital ID
  
  // Messages
  messages: ChatMessage[];
  
  // Metadata
  startTime: string;                   // Conversation start
  lastActivity: string;                // Last message time
  totalMessages: number;               // Message count
  userSatisfaction?: number;           // User rating (1-5)
  
  // Privacy
  retentionExpiry: string;             // When to delete
  anonymized: boolean;                 // PII removed
}

interface ChatMessage {
  id: string;                          // Message ID
  role: MessageRole;                   // User or Assistant
  content: string;                     // Message content
  timestamp: string;                   // Message timestamp
  
  // AI Response Metadata (for assistant messages)
  responseTime?: number;               // Generation time in ms
  confidence?: number;                 // AI confidence score
  sources?: string[];                  // Referenced document IDs
  
  // User Feedback
  helpful?: boolean;                   // User feedback
  reportedIssue?: boolean;             // User reported problem
}

type ChatType = 
  | "data-protection"
  | "digital-id";

type MessageRole = 
  | "user"
  | "assistant"
  | "system";      // System messages/notifications
```

---

## Future API Endpoints

### Countries API

```typescript
// Get all countries with basic information
GET /api/countries
Response: Country[]

// Get specific country details
GET /api/countries/{countryCode}
Response: Country

// Get countries by region
GET /api/countries?region={region}
Response: Country[]

// Get countries by legislation status
GET /api/countries?status={status}
Response: Country[]

// Search countries
GET /api/countries/search?q={query}
Response: Country[]
```

### Digital ID Systems API

```typescript
// Get all digital ID systems
GET /api/digital-id
Response: DigitalIDSystem[]

// Get digital ID system for specific country
GET /api/digital-id/{countryCode}
Response: DigitalIDSystem

// Get systems by implementation status
GET /api/digital-id?status={status}
Response: DigitalIDSystem[]

// Get systems with specific features
GET /api/digital-id?features={feature1,feature2}
Response: DigitalIDSystem[]
```

### Resources API

```typescript
// Get all resource documents
GET /api/resources
Response: ResourceDocument[]

// Get specific resource document
GET /api/resources/{documentId}
Response: ResourceDocument

// Search resources
GET /api/resources/search?q={query}&country={code}&type={type}
Response: ResourceDocument[]

// Get resources by country
GET /api/resources?country={countryCode}
Response: ResourceDocument[]

// Get resources by type
GET /api/resources?type={documentType}
Response: ResourceDocument[]
```

### Timeline API

```typescript
// Get all timeline events
GET /api/timeline
Response: TimelineEvent[]

// Get events by date range
GET /api/timeline?start={startDate}&end={endDate}
Response: TimelineEvent[]

// Get events by country
GET /api/timeline?country={countryCode}
Response: TimelineEvent[]

// Get events by type
GET /api/timeline?type={eventType}
Response: TimelineEvent[]

// Get featured events
GET /api/timeline/featured
Response: TimelineEvent[]
```

### Chat API

```typescript
// Start new chat conversation
POST /api/chat/conversations
Body: { chatType: ChatType }
Response: { conversationId: string }

// Send message to chat
POST /api/chat/conversations/{conversationId}/messages
Body: { content: string }
Response: { 
  messageId: string, 
  response: string, 
  sources?: string[] 
}

// Get chat history
GET /api/chat/conversations/{conversationId}
Response: ChatConversation

// Provide feedback on message
POST /api/chat/messages/{messageId}/feedback
Body: { helpful: boolean, comment?: string }
Response: { success: boolean }
```

### Analytics API

```typescript
// Get platform statistics
GET /api/analytics/stats
Response: {
  totalCountries: number,
  totalDocuments: number,
  totalChats: number,
  lastUpdated: string
}

// Get usage analytics (admin only)
GET /api/analytics/usage?period={period}
Response: {
  pageViews: number,
  uniqueUsers: number,
  popularResources: ResourceDocument[],
  searchQueries: string[]
}
```

---

## Error Handling

### Standard Error Response

```typescript
interface ApiError {
  error: {
    code: string;              // Error code (e.g., "COUNTRY_NOT_FOUND")
    message: string;           // Human-readable error message
    details?: any;             // Additional error details
    timestamp: string;         // Error occurrence time
    requestId: string;         // Unique request identifier
  }
}
```

### Common Error Codes

- `COUNTRY_NOT_FOUND` - Requested country does not exist
- `DOCUMENT_NOT_FOUND` - Requested document does not exist
- `INVALID_PARAMETER` - Invalid query parameter provided
- `RATE_LIMIT_EXCEEDED` - Too many requests from client
- `CHAT_SESSION_EXPIRED` - Chat session no longer valid
- `EXTERNAL_SERVICE_ERROR` - Upstream service failure
- `VALIDATION_ERROR` - Request validation failed

---

## Authentication & Authorization

### API Key Authentication (Future)

```typescript
// Header-based authentication
Headers: {
  'X-API-Key': 'your-api-key',
  'Content-Type': 'application/json'
}
```

### Rate Limiting

- **Public endpoints**: 1000 requests/hour per IP
- **Authenticated users**: 10,000 requests/hour
- **Chat endpoints**: 100 requests/hour per session
- **Admin endpoints**: No limit (internal use)

---

## Data Sources Integration

### Government APIs

```typescript
interface GovernmentDataSource {
  countryCode: string;
  apiEndpoint?: string;           // If government provides API
  updateFrequency: string;        // How often to check for updates
  lastSync: string;               // Last successful synchronization
  syncStatus: SyncStatus;         // Current sync status
  contactInfo: string;            // Government contact for updates
}

type SyncStatus = 
  | "Active"          // Regular updates working
  | "Manual"          // Requires manual updates
  | "Stale"           // Data may be outdated
  | "Unavailable";    // No reliable source
```

### External Integrations

- **World Bank APIs** - Economic indicators
- **UN Data APIs** - Development metrics  
- **African Union** - Continental policy updates
- **Legal databases** - LexisNexis, Westlaw for legal references
- **News APIs** - Policy change notifications

---

## Caching Strategy

### Frontend Caching

```typescript
// Service Worker caching configuration
const CACHE_CONFIG = {
  staticAssets: '1 year',        // Images, fonts, etc.
  mapData: '1 week',             // Geographic data
  countryData: '1 day',          // Policy information
  chatResponses: '1 hour',       // AI responses
  searchResults: '30 minutes'    // Search result caching
};
```

### Backend Caching (Future)

- **Redis** for session storage and frequently accessed data
- **CDN** for static assets and document delivery
- **Database query caching** for expensive aggregations
- **API response caching** with appropriate TTL values

---

## Monitoring & Analytics

### Performance Metrics

```typescript
interface PerformanceMetrics {
  endpoint: string;
  responseTime: number;          // Average response time (ms)
  throughput: number;            // Requests per second
  errorRate: number;             // Error percentage
  uptime: number;                // Availability percentage
  timestamp: string;
}
```

### Usage Analytics

```typescript
interface UsageAnalytics {
  feature: string;               // Feature being tracked
  action: string;                // Specific action taken
  userId?: string;               // User identifier (if logged in)
  sessionId: string;             // Session identifier
  metadata: Record<string, any>; // Additional context
  timestamp: string;
}
```

This API documentation provides a comprehensive foundation for future development while maintaining compatibility with the current frontend-focused implementation.