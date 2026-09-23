# System Architecture & Technical Blueprint

**Project Name:** AI-Powered Smart Document & Report Analyzer  
**Milestone:** Week 1 — Planning, Architecture & UI Wireframes

---

## 1. Executive Summary & Problem Context

Organizations and professionals encounter massive quantities of unstructured documents daily (contracts, quarterly financials, compliance reports, academic whitepapers, resumes). Manual extraction is error-prone and labor-intensive. 

The **AI-Powered Smart Document & Report Analyzer** solves this by establishing an asynchronous, multi-format pipeline that:
1. Ingests PDFs, Word (.docx), Scanned Images (PNG/JPG), and Text.
2. Extracts raw content using dedicated parsers and OCR engines.
3. Structures document insights using **Google Gemini 1.5/2.0 Flash** (with Groq Llama-3 fallback) strictly validated with **Zod Schemas**.
4. Eliminates redundant LLM token costs through **SHA-256 Content-Hash Caching** in Redis.
5. Provides interactive risk visualization, action items checklist, and server-side PDF export.

---

## 2. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Application (React + Vite + TailwindCSS)"]
        UploadView["Upload Studio (Multi-format Dropzone)"]
        DashboardView["Intelligence Dashboard (Status, Metrics, Risk)"]
        ReportView["Report Detail & Insights Viewer"]
    end

    subgraph API_Gateway["Express API Gateway (Node.js)"]
        AuthMW["JWT Auth & Refresh Rotation"]
        UploadRoute["POST /api/upload (Multer Memory Storage)"]
        ReportRoute["GET /api/reports/:id (Status & Insights)"]
        AnalyticsRoute["GET /api/reports/analytics/summary"]
    end

    subgraph Storage_Queue["Storage & Async Job Queue"]
        CloudinaryStorage[("Cloudinary (CDN Storage)")]
        BullMQQueue[("BullMQ + Redis Job Queue")]
    end

    subgraph Worker_Engine["Async Worker Processing Pipeline"]
        Extractor["Multi-Format Parser (pdf-parse, mammoth, Tesseract.js OCR)"]
        CacheCheck["SHA-256 Hash Caching Lookup"]
        AIEngine["Gemini AI Reasoning Engine (JSON Mode)"]
        ZodValidator["Zod Runtime Schema Validation"]
    end

    subgraph DB["Database Layer"]
        MongoDB[("MongoDB Atlas (Users, Reports)")]
        RedisCache[("Redis Memory Cache")]
    end

    UploadView -->|1. Multipart Upload| UploadRoute
    UploadRoute -->|2. Stream Buffer| CloudinaryStorage
    UploadRoute -->|3. Compute SHA-256 & Create Report| MongoDB
    UploadRoute -->|4. Push Job to Queue| BullMQQueue
    UploadRoute -->|5. Return 202 Queued| UploadView

    BullMQQueue -->|6. Worker Picks Job| Extractor
    Extractor -->|7. Check Cached Hash| CacheCheck
    CacheCheck -.->|Cache Hit (Instant)| MongoDB
    CacheCheck -->|Cache Miss| AIEngine
    AIEngine -->|8. Raw JSON Output| ZodValidator
    ZodValidator -->|9. Save Validated Insights & 'done'| MongoDB
    ZodValidator -->|10. Cache Response by Hash| RedisCache

    DashboardView -->|11. Poll Status & List Reports| ReportRoute
    ReportView -->|12. Fetch Full Report| ReportRoute
    ReportRoute -->|13. Read Data| MongoDB
```

---

## 3. Database Schema Specification

### 3.1 `User` Schema
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Unique user identifier |
| `name` | String | Required, Trim | Full name of user |
| `email` | String | Required, Unique, Indexed | User email address |
| `password` | String | Required, Hidden by default | Bcrypt hashed password |
| `role` | String | Enum: `['user', 'admin']` | User permissions |
| `refreshToken` | String | Hidden | Encrypted refresh token |
| `usage.documentsAnalyzed` | Number | Default: 0 | Total documents processed |
| `usage.tokensUsed` | Number | Default: 0 | Approximate LLM token tally |
| `createdAt` | Date | Default: Now | Account creation timestamp |

### 3.2 `Report` Schema
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Unique report identifier |
| `user` | ObjectId | Ref: 'User', Indexed | Owner user ID |
| `originalFile.fileName` | String | Required | Original document filename |
| `originalFile.url` | String | Required | Cloudinary secure CDN URL |
| `originalFile.publicId` | String | | Cloudinary public asset ID |
| `originalFile.fileType` | String | Required | MIME type (e.g., `application/pdf`) |
| `originalFile.sizeBytes` | Number | Required | File size in bytes |
| `originalFile.contentHash` | String | Indexed | SHA-256 hash for duplicate caching |
| `documentCategory` | String | Enum, Default: 'general' | 'legal', 'financial', 'academic', 'resume', 'compliance' |
| `status` | String | Enum, Indexed | 'queued', 'processing', 'done', 'failed' |
| `extractedText` | String | | Raw parsed text content |
| `aiInsights.summary` | String | | 3-4 sentence executive summary |
| `aiInsights.riskScore` | Number | Min: 0, Max: 100 | Calculated risk index |
| `aiInsights.riskLevel` | String | Enum: 'Low', 'Medium', 'High' | Severity indicator |
| `aiInsights.actionItems` | Array of Strings | Max: 20 | Actionable checklist |
| `aiInsights.keyEntities` | Array of Objects | `{ label, value, category }` | Extracted names, dates, amounts |
| `aiInsights.tags` | Array of Strings | Max: 10 | Contextual search tags |
| `isCachedResult` | Boolean | Default: false | True if retrieved from Redis cache |
| `exportedPdfUrl` | String | | URL of generated PDF export |
| `processingTimeMs` | Number | | Total execution duration |
| `createdAt` | Date | Default: Now, Indexed | Creation timestamp |

---

## 4. REST API Contract

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Login user, set HTTP-only cookie, return access & refresh tokens
- `POST /api/auth/refresh` — Issue new access token using valid refresh token
- `POST /api/auth/logout` — Invalidate session and clear auth cookies
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Document Upload & Processing Endpoints
- `POST /api/upload` — Multipart form upload (`file`, `category`). Returns `202 Accepted` with `reportId` and `status: 'queued'`.

### Reports & Analytics Endpoints
- `GET /api/reports` — Paginated list of user reports with optional query filters (`status`, `category`, `page`, `limit`).
- `GET /api/reports/:id` — Get full report insights, extracted text, and live processing status.
- `DELETE /api/reports/:id` — Delete report from database and delete binary asset from Cloudinary.
- `GET /api/reports/analytics/summary` — Aggregate metrics: total analyzed, high-risk count, average risk score, cache hit savings %.
- `POST /api/reports/:id/export` — Trigger server-side PDF compilation.

---

## 5. UI Wireframes & Layout Specs

### Screen 1: Upload Studio (`/upload`)
- **Category Preset Selector**: 6 Persona Cards (Legal Contract, Financial Statement, Research Paper, Resume, Compliance Audit, General).
- **Interactive Dropzone**: Visual feedback for file drag-and-drop, format validation, size limit guard (10MB).
- **Live Progress Meter**: Upload streaming status indicator with queue acknowledgment banner.

### Screen 2: Intelligence Dashboard (`/dashboard`)
- **Metric Tiles**: Total Processed, High Risk Alerts, Average Risk Score, Cache Savings %.
- **Search & Filter Bar**: Instant search by file name + category tag pills.
- **Documents Data Table**: File name, category badge, status badge, risk indicator, upload date, and quick action buttons.

### Screen 3: Report Detail & Insights Viewer (`/reports/:id`)
- **Live Status Poller**: Automatically polls server every 3s while status is `queued` or `processing`.
- **Risk Score Gauge**: Visual circular SVG meter with color thresholding (Green for Low, Yellow for Medium, Red for High).
- **Executive Summary Card**: AI-generated structured summary.
- **Interactive Action Items Checklist**: Checkbox list allowing users to mark tasks as completed.
- **Key Entities Badges**: Extracted names, dates, amounts, and jurisdictions.
- **Raw Extracted Text Tab**: Monospace viewer with one-click copy functionality.
