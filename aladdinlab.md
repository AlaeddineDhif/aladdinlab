# Aladdin's Lab — Technical Documentation

> **Project:** Aladdin's Lab — Premier Technical Hub for 3D Printing, Robotics & Embedded Systems
> **Stack:** Spring Boot 3.2.5 (Backend) + Angular 17.3 (Frontend) + PostgreSQL / Supabase (Database)
> **Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Backend — `aladdins-lab-backend`](#3-backend)
   - 3.1 [Tech Stack & Dependencies](#31-tech-stack--dependencies)
   - 3.2 [Project Structure](#32-project-structure)
   - 3.3 [Application Entry Point](#33-application-entry-point)
   - 3.4 [Configuration](#34-configuration)
   - 3.5 [Entity Layer](#35-entity-layer)
   - 3.6 [DTO Layer](#36-dto-layer)
   - 3.7 [Repository Layer](#37-repository-layer)
   - 3.8 [Service Layer](#38-service-layer)
   - 3.9 [Controller Layer](#39-controller-layer)
   - 3.10 [Security Configuration](#310-security-configuration)
   - 3.11 [Global Exception Handling](#311-global-exception-handling)
   - 3.12 [API Endpoints](#312-api-endpoints)
4. [Frontend — `aladdins-lab-frontend`](#4-frontend)
   - 4.1 [Tech Stack & Dependencies](#41-tech-stack--dependencies)
   - 4.2 [Project Structure](#42-project-structure)
   - 4.3 [Entry Point & Routing](#43-entry-point--routing)
   - 4.4 [Global Styles & Design System](#44-global-styles--design-system)
   - 4.5 [Root Component](#45-root-component)
   - 4.6 [Pages](#46-pages)
   - 4.7 [Components](#47-components)
   - 4.8 [Services & Data Models](#48-services--data-models)
   - 4.9 [Responsive Design Strategy](#49-responsive-design-strategy)
5. [Database Schema](#5-database-schema)
6. [Running the Application](#6-running-the-application)
7. [Development Roadmap](#7-development-roadmap)

---

## 1. Project Overview

Aladdin's Lab is a full-stack web application that serves as a digital storefront and contact hub for a technical engineering practice specializing in:

- **3D Printing** — Additive manufacturing, prototyping, and production
- **Robotics** — Embedded control systems, automation, and robot design
- **Embedded Systems** — Firmware, microcontrollers, and IoT integration
- **Digital Engineering** — CAD/CAM, simulation, and digital twin development

The application provides a public-facing landing page and a "Work With Me" contact form that allows potential clients, sponsors, and collaborators to submit inquiries directly to the lab.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Browser                             │
│           Angular 17 SPA on http://localhost:4200             │
└──────────────────────┬──────────────────────────────────────┘
                       │  HTTP (REST/JSON)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Spring Boot API Server                         │
│           Running on http://localhost:8080                     │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │Controller │→│  Service  │→│Repository│→│    JPA /     │  │
│  │  (REST)   │  │ (Business)│  │  (Data)  │  │  Hibernate  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────┬──────┘  │
│                                                    │          │
└────────────────────────────────────────────────────┼──────────┘
                                                     │ JDBC
                                                     ▼
                                    ┌─────────────────────────────┐
                                    │   Supabase PostgreSQL DB     │
                                    │  (via Supavisor Pooler)      │
                                    │  aws-0-eu-west-1             │
                                    └─────────────────────────────┘
```

**Communication Flow:**
1. Angular client sends HTTP requests to Spring Boot API
2. Spring Boot validates, processes, and persists data
3. Data is stored in Supabase-hosted PostgreSQL via Hibernate JPA
4. Responses flow back through the same layers as JSON

**Key Design Decisions:**
- **Standalone Angular 17 components** (no NgModules) for simplicity
- **Lazy-loaded routes** for optimal initial load time
- **Stateless REST API** with Spring Security
- **Supavisor connection pooler** (session mode) to handle IPv4-only environments
- **HikariCP** tuned for cloud database latency

---

## 3. Backend

### 3.1 Tech Stack & Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| Spring Boot Starter Web | 3.2.5 | REST API framework |
| Spring Boot Starter Data JPA | 3.2.5 | Database ORM (Hibernate 6.4) |
| Spring Boot Starter Validation | 3.2.5 | Bean validation (`@Valid`, `@NotBlank`, etc.) |
| Spring Boot Starter Security | 3.2.5 | API security, CORS, CSRF protection |
| jjwt (io.jsonwebtoken) | 0.12.5 | JWT authentication (scaffolding for future) |
| PostgreSQL JDBC Driver | 42.6.2 | Database connectivity |
| Lombok | Latest | Boilerplate reduction (`@Data`, `@Builder`, etc.) |
| Java | 17 | Language & runtime |

### 3.2 Project Structure

```
aladdins-lab-backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/aladdinslab/api/
        │   ├── AladdinsLabApplication.java          # Entry point
        │   ├── config/
        │   │   └── SecurityConfig.java              # Spring Security setup
        │   ├── controller/
        │   │   └── ContactInquiryController.java    # REST endpoints
        │   ├── dto/
        │   │   ├── ContactInquiryRequest.java       # Input validation DTO
        │   │   └── ContactInquiryResponse.java      # Output DTO
        │   ├── entity/
        │   │   └── ContactInquiry.java              # JPA entity
        │   ├── exception/
        │   │   └── GlobalExceptionHandler.java      # @RestControllerAdvice
        │   ├── repository/
        │   │   └── ContactInquiryRepository.java    # Spring Data JPA
        │   └── service/
        │       └── ContactInquiryService.java       # Business logic
        └── resources/
            └── application.properties               # Configuration
```

### 3.3 Application Entry Point

**File:** `AladdinsLabApplication.java`

```java
@SpringBootApplication
public class AladdinsLabApplication {
    public static void main(String[] args) {
        SpringApplication.run(AladdinsLabApplication.class, args);
    }
}
```

Standard Spring Boot bootstrap. No special configuration required.

### 3.4 Configuration

**File:** `application.properties`

```properties
spring.application.name=aladdins-lab-backend
server.port=8080

# Supabase PostgreSQL via Supavisor Session Pooler
spring.datasource.url=jdbc:postgresql://aws-0-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true
spring.datasource.username=postgres.yprbpsvjjeytbvwscesv
spring.datasource.password=Alaeddine1919
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate DDL Auto-generation
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# HikariCP Connection Pool Tuning
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.connection-timeout=20000
```

**Note:** The `pgbouncer=true` parameter in the JDBC URL tells the PostgreSQL driver to avoid using `SET` statements that are incompatible with connection poolers.

### 3.5 Entity Layer

**File:** `entity/ContactInquiry.java`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `Long` | `@Id`, `@GeneratedValue(IDENTITY)` | Auto-generated primary key |
| `name` | `String` | `@NotBlank`, `@Size(2-100)` | Full name of requester |
| `email` | `String` | `@NotBlank`, `@Email`, `@Size(max=150)` | Contact email |
| `inquiryType` | `String` | `@NotBlank`, `@Size(max=50)` | Category (Sponsorship, Collaboration, etc.) |
| `message` | `String` | `@NotBlank`, `@Size(10-2000)`, `columnDefinition=TEXT` | Inquiry details |
| `createdAt` | `LocalDateTime` | `nullable=false`, `updatable=false` | Auto-set via `@PrePersist` |

The `@PrePersist` callback auto-populates `createdAt` before the entity is persisted. Lombok `@Builder` provides a fluent creation API.

### 3.6 DTO Layer

**`ContactInquiryRequest.java`** — Input DTO with the same validation constraints as the entity. Separated from the entity to avoid coupling the API contract to the persistence model.

**`ContactInquiryResponse.java`** — Output DTO exposing all fields including `id` and `createdAt` (which the client doesn't send).

### 3.7 Repository Layer

**File:** `repository/ContactInquiryRepository.java`

```java
@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {
    List<ContactInquiry> findByInquiryTypeOrderByCreatedAtDesc(String inquiryType);
}
```

Uses Spring Data JPA's automatic query derivation. Custom method allows filtering inquiries by type, sorted by most recent first.

### 3.8 Service Layer

**File:** `service/ContactInquiryService.java`

**Key Operations:**
- **`createInquiry(ContactInquiryRequest)`** — Validates, sanitizes (trims whitespace, lowercases email), builds entity, persists, logs, and returns response DTO
- **`mapToResponse(ContactInquiry)`** — Private mapper converting entity to response DTO

All operations are `@Transactional` to ensure data integrity.

### 3.9 Controller Layer

**File:** `controller/ContactInquiryController.java`

| Method | Endpoint | Request Body | Response | Status |
|---|---|---|---|---|
| `POST` | `/api/v1/inquiries` | `ContactInquiryRequest` (JSON) | `ContactInquiryResponse` (JSON) | `201 Created` |

- Uses `@Valid` for automatic validation
- `@CrossOrigin(origins = "http://localhost:4200")` for CORS during development

### 3.10 Security Configuration

**File:** `config/SecurityConfig.java`

- **CORS:** Allows `http://localhost:4200` with GET, POST, PUT, DELETE, OPTIONS methods
- **CSRF:** Disabled (stateless API)
- **Session:** Stateless (no HTTP session)
- **Authorization:** All `/api/v1/**` endpoints are public; remaining requests require authentication (currently no impact since all endpoints are under `/api/v1`)
- **JWT dependencies are declared** in `pom.xml` but **not yet wired** into the security chain (future authentication feature)

### 3.11 Global Exception Handling

**File:** `exception/GlobalExceptionHandler.java`

**Handled Exceptions:**

| Exception | HTTP Status | Response Format |
|---|---|---|
| `MethodArgumentNotValidException` | `400 Bad Request` | `{ timestamp, status, errors: { field: message } }` |
| `Exception` (generic) | `500 Internal Server Error` | `{ timestamp, status, error: "..." }` |

### 3.12 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/inquiries` | Submit a contact inquiry |
| (Future) | `/api/v1/auth/**` | Authentication endpoints |
| (Future) | `/api/v1/inquiries` | `GET` to list/query inquiries |

---

## 4. Frontend

### 4.1 Tech Stack & Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| Angular | 17.3 | SPA framework (standalone components) |
| TypeScript | ~5.4 | Typed JavaScript |
| Angular Router | 17.3 | Client-side routing (lazy loading) |
| Angular Forms | 17.3 | Reactive forms with validation |
| Angular HTTP Client | 17.3 | API communication |
| RxJS | ~7.8 | Reactive programming |
| Zone.js | ~0.14 | Change detection |

### 4.2 Project Structure

```
aladdins-lab-frontend/
├── angular.json
├── package.json
├── tsconfig.json / tsconfig.app.json
├── src/
│   ├── index.html                     # Shell HTML
│   ├── main.ts                        # Bootstrap & routing
│   ├── styles.css                     # Global CSS & design tokens
│   ├── favicon.ico
│   ├── assets/                        # Static assets (empty)
│   ├── environments/
│   │   ├── environment.ts             # Dev: apiBaseUrl=http://localhost:8080/api/v1
│   │   └── environment.prod.ts        # Prod: apiBaseUrl=/api/v1
│   └── app/
│       ├── app.component.ts           # Root component (navbar + router-outlet + footer)
│       ├── components/
│       │   ├── navbar/
│       │   │   └── navbar.component.ts
│       │   ├── footer/
│       │   │   └── footer.component.ts
│       │   └── work-with-me/
│       │       └── work-with-me-form.component.ts
│       ├── pages/
│       │   ├── home/
│       │   │   └── home.component.ts
│       │   └── work-with-me-page/
│       │       └── work-with-me-page.component.ts
│       ├── services/
│       │   └── inquiry.service.ts
│       └── models/
│           └── contact-inquiry.model.ts
```

### 4.3 Entry Point & Routing

**File:** `main.ts`

Routes are defined using Angular's standalone `provideRouter()` API with **lazy loading**:

| Path | Component | Load Strategy |
|---|---|---|
| `/` | `HomeComponent` | Lazy (`loadComponent`) |
| `/work-with-me` | `WorkWithMePageComponent` | Lazy (`loadComponent`) |
| `**` (wildcard) | Redirect to `/` | Immediate |

HTTP client uses `withFetch()` for modern Fetch API support.

### 4.4 Global Styles & Design System

**File:** `styles.css`

**CSS Custom Properties (Design Tokens):**

```css
--primary: #0f172a;           /* Dark navy - backgrounds, text */
--primary-light: #1e293b;     /* Lighter navy */
--accent: #3b82f6;            /* Blue - CTAs, links, highlights */
--accent-hover: #2563eb;      /* Darker blue for hover states */
--accent-glow: rgba(59,130,246,0.25);  /* Focus ring */
--gold: #f59e0b;              /* Accent gold */
--surface: #ffffff;            /* Card backgrounds */
--surface-alt: #f8fafc;       /* Page background */
--text: #0f172a;              /* Primary text */
--text-secondary: #64748b;    /* Muted text */
--border: #e2e8f0;            /* Borders & dividers */
--danger: #ef4444;            /* Error states */
--success: #22c55e;           /* Success states */
--radius: 12px;               /* Large border radius */
--radius-sm: 8px;             /* Small border radius */
--shadow: 0 1px 3px rgba(0,0,0,0.08);
--shadow-lg: 0 10px 40px rgba(0,0,0,0.12);
--transition: 200ms cubic-bezier(0.4,0,0.2,1);
```

**Responsive Container System:**

| Breakpoint | Container Max-Width | Padding |
|---|---|---|
| < 480px (phones) | 100% | 12px |
| 480-768px (large phones) | 100% | 16px |
| 768-1200px (tablets) | 100% | 20px |
| 1200-1600px (desktops) | 1200px | 24px |
| > 1600px (large displays) | 1400px | 32px |

### 4.5 Root Component

**File:** `app.component.ts`

Provides the application shell:
- `<app-navbar>` at the top (sticky)
- `<main>` with `<router-outlet />` for page content
- `<app-footer>` at the bottom

### 4.6 Pages

#### Home Page (`pages/home/home.component.ts`)

The landing page hero section featuring:
- Gradient text heading using `background-clip: text`
- Tagline listing services (3D Printing, Robotics, Embedded Systems, Digital Engineering)
- Call-to-action button linking to `/work-with-me`
- Full viewport height layout with centered content

#### Work With Me Page (`pages/work-with-me-page/work-with-me-page.component.ts`)

A simple page wrapping the `WorkWithMeFormComponent` with a header:
- Title: "Work With Me"
- Subtitle explaining the purpose (sponsorship, collaboration, custom projects)

### 4.7 Components

#### Navbar Component (`components/navbar/navbar.component.ts`)

- **Sticky** header with `backdrop-filter: blur(16px)` frosted glass effect
- Logo with diamond icon + "Aladdin's Lab" text
- Navigation links: Home, Work With Me
- `RouterLinkActive` highlights the current page
- **Responsive:** Height reduces to 56px on mobile (< 480px); scales up on large displays

#### Footer Component (`components/footer/footer.component.ts`)

- Dark background (`--primary` color)
- Brand name with tagline (all services listed)
- Dynamic copyright year using `new Date().getFullYear()`
- **Responsive:** Padding and margins scale with viewport

#### Work With Me Form (`components/work-with-me/work-with-me-form.component.ts`)

A full-featured reactive form with:

| Field | Type | Validators |
|---|---|---|
| Full Name | Text input | Required, 2-100 chars |
| Email Address | Email input | Required, valid email, max 150 |
| Inquiry Type | Select dropdown | Required (options: Sponsorship, Collaboration, Custom Project, General Inquiry) |
| Message | Textarea | Required, 10-2000 chars |

**State Management:**
- Uses Angular Signals (`signal()`) for `submitted`, `submitting`, `error` states
- Reactive Forms with `FormBuilder`
- Success state with checkmark animation and thank-you message
- Loading spinner during submission
- Error banner on API failure
- Reset functionality to send another inquiry

**Styling:**
- Centered card layout with `max-width: min(560px, 90vw)`
- All font sizes and spacing use `clamp()` for fluid scaling
- Error states with red borders and inline error messages
- Smooth transitions on focus and hover

### 4.8 Services & Data Models

**Data Model (`models/contact-inquiry.model.ts`):**

```typescript
export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt?: string;
}

export const INQUIRY_TYPES = [
  'Sponsorship',
  'Collaboration',
  'Custom Project',
  'General Inquiry'
] as const;
```

**API Service (`services/inquiry.service.ts`):**

- Injected via `providedIn: 'root'`
- Uses Angular `HttpClient`
- Single method: `submitInquiry(inquiry)` → `POST /api/v1/inquiries`
- Returns `Observable<ContactInquiry>`
- Currently hardcodes `http://localhost:8080/api/v1/inquiries` (to be refactored to use `environment.apiBaseUrl`)

### 4.9 Responsive Design Strategy

The application uses a **fluid responsive approach** with three key techniques:

1. **`clamp()` Function** — Font sizes, spacing, and dimensions use `clamp(min, preferred, max)` to scale smoothly between breakpoints without media query explosion.

   ```css
   .hero-title {
     font-size: clamp(2.2rem, 6vw, 5rem);
   }
   ```

2. **Mobile-First Breakpoints** — Strategic media queries handle edge cases:

   | Breakpoint | Target |
   |---|---|
   | `max-width: 480px` | Phones: reduce padding, full-width cards, smaller navbar |
   | `max-width: 768px` | Tablets: tighter container padding |
   | `max-width: 1200px` | Smaller desktops: moderate padding |
   | `min-width: 1600px` | Large displays: wider container (1400px), larger typography |

3. **CSS Container System** — The `.container` class uses percentage-based width with `max-width` constraints, centered with `margin: 0 auto`, ensuring content never stretches too wide or shrinks too narrow.

---

## 5. Database Schema

**Table:** `contact_inquiries`

```sql
CREATE TABLE contact_inquiries (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL,
    inquiry_type VARCHAR(50)    NOT NULL,
    message     TEXT            NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiry_type ON contact_inquiries(inquiry_type);
```

The schema is auto-generated by Hibernate (`ddl-auto=update`) and managed via JPA entity mappings. No manual migration scripts are required during development.

---

## 6. Running the Application

### Prerequisites

- Java 17+
- Node.js 18+ (with npm)
- Angular CLI (optional, use `npx ng`)

### Backend

```bash
cd aladdins-lab-backend
.\mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### Frontend

```bash
cd aladdins-lab-frontend
npm install
npx ng serve
```

The dev server starts on `http://localhost:4200`. Both servers must run simultaneously for full functionality.

### Database

The application connects to a Supabase-hosted PostgreSQL instance using the Supavisor connection pooler (session mode). The connection is configured in `application.properties`:

- **Host:** `aws-0-eu-west-1.pooler.supabase.com`
- **Port:** `5432` (session pooler)
- **Database:** `postgres`
- **Username:** `postgres.yprbpsvjjeytbvwscesv`
- **Auth:** Password-based

---

## 7. Development Roadmap

### Completed
- [x] Spring Boot backend setup with REST API
- [x] Contact inquiry form (entity, DTOs, service, controller)
- [x] JPA/Hibernate integration with Supabase PostgreSQL
- [x] Validation and error handling
- [x] CORS and security configuration
- [x] Angular 17 standalone app with lazy routing
- [x] Home page hero with gradient typography
- [x] Work With Me form with reactive validation
- [x] Responsive design with fluid typography and layout
- [x] Supavisor pooler connection for IPv4 compatibility

### Planned / In Progress
- [ ] **JWT Authentication** — Dependencies already included in `pom.xml`; need to implement JWT filter, login endpoint, token issuance/validation
- [ ] **Admin Dashboard** — Secure area for viewing and managing contact inquiries
- [ ] **Inquiry List API** — `GET /api/v1/inquiries` with pagination, filtering, search
- [ ] **Email Notifications** — Auto-reply or notification when an inquiry is submitted
- [ ] **Project Showcase** — Portfolio/portfolio page displaying completed projects
- [ ] **Services Page** — Detailed breakdown of offered services with pricing or process
- [ ] **Asset Pipeline** — Add images, icons, and other static assets to `src/assets/`
- [ ] **Unit Tests** — Backend (JUnit + Mockito) and frontend (Jasmine + Karma)
- [ ] **Production Build** — Optimized Angular build, deploy to cloud hosting
- [ ] **Dockerization** — Docker Compose for local development with PostgreSQL
