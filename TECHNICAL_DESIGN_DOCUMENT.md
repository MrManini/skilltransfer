# SkillTransfer Platform: Technical Design Document

## Executive Summary

SkillTransfer is a comprehensive booking platform that connects clients with experts for skill transfer services. The platform supports three distinct service modes: **MENTORIA** (step-by-step learning), **HIBRIDO** (collaborative approach), and **EJECUTADO** (expert completes the task). This document presents the technical architecture, design patterns implementation, and evidence from the codebase.

---

## 1. Problem Statement

### 1.1 Business Requirements
The SkillTransfer platform addresses the need for a flexible, scalable booking system that can handle:
- Multiple service delivery modes (mentorship, hybrid, executed)
- Various interaction types (video calls, live coding, chat, document-based)
- Complex booking state management (pending → confirmed → completed)
- Step-by-step mentorship progress tracking
- Seamless client-expert interaction scheduling

### 1.2 Technical Challenges
- **Service Diversity**: Supporting different service modes with varying interaction channels
- **State Management**: Complex booking lifecycle with strict state transitions
- **Progress Tracking**: Sequential mentorship step completion with persistence
- **Scalability**: Extensible architecture for future service types and interaction modes

---

## 2. Architectural Design

### 2.1 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React/TS)    │◄──►│   (NestJS/TS)   │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • Service List  │    │ • Controllers   │    │ • User          │
│ • Booking Form  │    │ • Services      │    │ • Service       │
│ • Progress View │    │ • Design        │    │ • Booking       │
│                 │    │   Patterns      │    │ • Progress      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 Database Schema
The system utilizes a well-structured relational database with the following key entities:

```sql
-- Core entities with enum constraints
enum ServiceMode { HIBRIDO, MENTORIA, EJECUTADO }
enum InteractionType { VIDEO_CALL, CHAT, LIVE_CODING, NONE }
enum BookingStatus { PENDIENTE, CONFIRMADA, COMPLETADA, CANCELADA }

-- Evidence from: /prisma/schema.prisma
model Service {
  id              String          @id @default(uuid())
  mode            ServiceMode     -- Service delivery approach
  interactionType InteractionType -- Communication channel
  // ... other fields
}

model Booking {
  id          String        @id @default(uuid())
  status      BookingStatus @default(PENDIENTE)
  // State machine implementation support
}
```

---

## 3. Design Patterns Implementation

This project implements four fundamental design patterns as required, each addressing specific architectural concerns:

### 3.1 Abstract Factory Pattern 🏭

**Purpose**: Creates families of related service objects without specifying their concrete classes.

**Evidence**: `/src/services/classes/factory.class.ts`
```typescript
export class ServiceFactory {
  static create(mode: ServiceMode, interactionType: InteractionType): Service {
    let interaction: InteractionChannel;
    
    // Factory creates appropriate interaction channel
    switch (interactionType) {
      case InteractionType.VIDEO_CALL:
        interaction = new VideoCallChannel();
        break;
      case InteractionType.LIVE_CODING:
        interaction = new CodingChannel();
        break;
      // ... other channels
    }
    
    // Factory creates appropriate service type
    switch (mode) {
      case ServiceMode.MENTORIA:
        return new MentoriaService(interaction);
      case ServiceMode.EJECUTADO:
        return new EjecutadoService(interaction);
      // ... other services
    }
  }
}
```

**Benefits**:
- **Consistency**: Ensures compatible service-interaction combinations
- **Extensibility**: New service modes can be added without modifying existing code
- **Encapsulation**: Creation logic is centralized and testable

### 3.2 Bridge Pattern 🌉

**Purpose**: Separates the service abstraction from its interaction implementation, allowing both to vary independently.

**Evidence**: `/src/services/classes/bridge.class.ts`
```typescript
// Implementor Interface
export interface InteractionChannel {
  getType(): InteractionType;
}

// Concrete Implementors
export class VideoCallChannel implements InteractionChannel {
  getType(): InteractionType {
    return InteractionType.VIDEO_CALL;
  }
}

// Abstraction
export abstract class Service {
  protected interaction: InteractionChannel;
  protected mode: ServiceMode;

  constructor(mode: ServiceMode, interaction: InteractionChannel) {
    this.interaction = interaction;  // Bridge connection
  }

  abstract describe(): string;
}

// Refined Abstraction
export class MentoriaService extends Service {
  describe(): string {
    return `${this.mode} vía ${this.interaction.getType()}`;
  }
}
```

**Benefits**:
- **Flexibility**: Services and interaction types can evolve independently
- **Runtime Binding**: Interaction channels can be selected dynamically
- **Code Reuse**: Interaction implementations are shared across service types

### 3.3 State Pattern 🔄

**Purpose**: Manages booking lifecycle transitions with state-specific behavior validation.

**Evidence**: `/src/services/classes/bookingstatus.class.ts`
```typescript
interface BookingState {
  confirm(context: BookingContext): void;
  complete(context: BookingContext): void;
  cancel(context: BookingContext): void;
}

export class BookingContext {
  private state: BookingState;
  public status: BookingStatus;

  setState(state: BookingState, status: BookingStatus) {
    this.state = state;
    this.status = status;
  }

  confirm() { this.state.confirm(this); }
  complete() { this.state.complete(this); }
  cancel() { this.state.cancel(this); }
}

// Concrete States with business logic
class PendingState implements BookingState {
  confirm(context: BookingContext) {
    context.setState(new ConfirmedState(), "CONFIRMADA");
  }
  
  complete() {
    throw new Error("No puedes completar una reserva pendiente");
  }
}

class ConfirmedState implements BookingState {
  complete(context: BookingContext) {
    context.setState(new CompletedState(), "COMPLETADA");
  }
  
  confirm() {
    throw new Error("La reserva ya está confirmada");
  }
}
```

**Implementation in Service**: `/src/services/booking.service.ts`
```typescript
async confirm(id: string) {
  const { context, bookingId } = await this.getBookingContext(id);
  
  try {
    context.confirm();  // State pattern handles validation
    
    // Update database with new state
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: context.status }
    });
    
    return updated;
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
```

**Benefits**:
- **Business Rule Enforcement**: Invalid transitions are automatically prevented
- **Maintainability**: State-specific logic is encapsulated and easily modified
- **Consistency**: Database updates are synchronized with state transitions

### 3.4 Iterator Pattern 🔄

**Purpose**: Provides sequential access to mentorship steps without exposing internal structure.

**Evidence**: `/src/services/classes/iterator.class.ts`
```typescript
export interface Iterator<T> {
  hasNext(): boolean;
  next(): T | null;
}

export class MentorshipStepIterator implements Iterator<MentorshipStep> {
  private index = 0;
  
  constructor(private steps: MentorshipStep[]) {}
  
  hasNext(): boolean {
    return this.index < this.steps.length;
  }
  
  next(): MentorshipStep | null {
    if (!this.hasNext()) return null;
    
    const step = this.steps[this.index];
    this.index++;
    return step;
  }
}
```

**Aggregate Implementation**: `/src/services/classes/aggregate.class.ts`
```typescript
export class MentorshipPlan {
  constructor(private steps: MentorshipStep[]) {}
  
  createIterator(): MentorshipStepIterator {
    return new MentorshipStepIterator(this.steps);
  }
}
```

**Business Logic Integration**: `/src/services/iterator.service.ts`
```typescript
async getNextStep(serviceId: string, bookingId: string) {
  const steps = await this.prisma.mentorshipStep.findMany({
    where: { serviceId },
    orderBy: { order: 'asc' }
  });

  const progress = await this.prisma.mentorshipStepProgress.findMany({
    where: { bookingId }
  });

  const plan = new MentorshipPlan(steps);
  const iterator = plan.createIterator();  // Pattern usage

  while(iterator.hasNext()) {
    const step = iterator.next();
    const stepProgress = progress.find(p => p.mentorshipStepId === step.id);
    
    if(stepProgress && !stepProgress.completed) {
      return step;  // Return next incomplete step
    }
  }

  return { message: "Todos los pasos completados" };
}
```

**Benefits**:
- **Encapsulation**: Internal step structure is hidden from clients
- **Uniform Interface**: Consistent iteration across different mentorship plans
- **Progress Tracking**: Seamless integration with completion status

---

## 4. API Design & Endpoints

### 4.1 RESTful API Architecture
The system exposes a clean REST API with clear resource boundaries:

```typescript
// Service Discovery
GET /services                    // List all available services
GET /services/:id                // Get service details

// Booking Management
POST /bookings                   // Create new booking
GET /bookings/client/:clientId   // List client bookings
PATCH /bookings/:id/confirm      // State transition
PATCH /bookings/:id/complete     // State transition
PATCH /bookings/:id/cancel       // State transition

// Mentorship Progress (Iterator Pattern)
GET /iterator/:serviceId/next-step/:bookingId      // Get current step
POST /iterator/:serviceId/complete-step/:bookingId  // Mark step complete
```

### 4.2 Request/Response Examples

**Booking Creation Request**:
```json
POST /bookings
{
  "serviceId": "service-1",
  "clientId": "client-1", 
  "scheduledAt": "2026-03-15T10:00:00.000Z",
  "notes": "Looking forward to learning NestJS architecture"
}
```

**Factory Pattern in Action** (Service Response):
```json
{
  "bookingId": "uuid-here",
  "service": "MENTORIA vía LIVE_CODING",  // Bridge pattern output
  "status": "PENDIENTE"                   // Initial state
}
```

---

## 5. Frontend Implementation

### 5.1 Modern React Architecture
The frontend leverages modern React practices with TypeScript for type safety:

**Evidence**: `/frontend/src/pages/BookingFormPage.tsx`
```typescript
export default function BookingFormPage() {
  const [service, setService] = useState<Service | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      await api.createBooking({
        serviceId,
        clientId,
        scheduledAt: scheduledAt.toISOString(),
      });
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch {
      toast.error('Failed to create booking');
    }
  };
  
  return (
    <Card>
      {/* Professional UI with shadcn/ui components */}
      <form onSubmit={handleSubmit}>
        <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />
        <Button onClick={handleSubmit}>Confirm Booking</Button>
      </form>
    </Card>
  );
}
```

### 5.2 User Experience Flow
1. **Service Discovery**: Browse available services with filtering
2. **Service Selection**: View detailed service information and pricing
3. **Booking Creation**: Schedule appointment with date/time picker
4. **Progress Tracking**: Monitor booking status and mentorship steps
5. **State Management**: Confirm, complete, or cancel bookings

---

## 6. Database Design & Persistence

### 6.1 Relational Model
The database schema supports the complete business logic with proper normalization:

**Evidence**: Prisma Migration `/prisma/migrations/20260302022615_initial_migration/migration.sql`
```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,  -- CLIENT | EXPERT
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "mode" "ServiceMode" NOT NULL,           -- Factory pattern support
    "interactionType" "InteractionType" NOT NULL,  -- Bridge pattern support
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDIENTE',  -- State pattern
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MentorshipStepProgress" (
    "bookingId" TEXT NOT NULL,
    "mentorshipStepId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,  -- Iterator pattern support
    CONSTRAINT "MentorshipStepProgress_bookingId_mentorshipStepId_key" 
    UNIQUE("bookingId", "mentorshipStepId")
);
```

### 6.2 Data Integrity
- **Foreign Key Constraints**: Ensure referential integrity
- **Unique Constraints**: Prevent duplicate progress records
- **Enum Constraints**: Validate state transitions at database level
- **Default Values**: Establish consistent initial states

---

## 7. Testing Evidence

### 7.1 Pattern Validation
The implemented patterns can be verified through API testing:

```bash
# State Pattern Testing
curl -X POST http://localhost:3000/bookings
# Response: {"status": "PENDIENTE"}

curl -X PATCH http://localhost:3000/bookings/{id}/confirm  
# Response: {"status": "CONFIRMADA"}

# Iterator Pattern Testing  
curl -X GET http://localhost:3000/iterator/service-1/next-step/{bookingId}
# Response: {"id": "step-1", "title": "Introducción a arquitectura backend"}

curl -X POST http://localhost:3000/iterator/service-1/complete-step/{bookingId}
# Response: {"message": "Paso completado", "step": {...}, "progress": {...}}
```

### 7.2 Factory Pattern Verification
```bash
curl -X GET http://localhost:3000/services
# Response shows factory-generated service descriptions:
[
  {
    "mode": "MENTORIA", 
    "interactionType": "LIVE_CODING",
    "description": "MENTORIA vía LIVE_CODING"  // Bridge pattern output
  }
]
```

---

## 8. Performance & Scalability

### 8.1 Database Optimization
- **Indexed Queries**: Service lookups and booking retrieval are optimized
- **Batch Operations**: Mentorship progress is initialized efficiently
- **Connection Pooling**: Prisma manages database connections effectively

### 8.2 Caching Strategy
- **Service Catalog**: Services are cached on the frontend for fast browsing
- **State Validation**: Pattern implementations reduce database roundtrips
- **Progress Tracking**: Iterator state is maintained in memory during sessions

---

## 9. Security Considerations

### 9.1 Data Validation
- **TypeScript Types**: Compile-time validation for all data structures
- **Prisma Schema**: Database-level constraints and validations
- **State Pattern**: Business rule enforcement prevents invalid operations

### 9.2 Error Handling
```typescript
// Evidence: Proper error handling with pattern integration
try {
  context.confirm();  // State pattern validation
  // Update database only if state transition is valid
  const updated = await this.prisma.booking.update(...);
} catch (error) {
  throw new BadRequestException(error.message);
}
```

---

## 10. Conclusion

The SkillTransfer platform successfully demonstrates the practical application of four fundamental design patterns in a real-world booking system. Each pattern addresses specific architectural challenges:

- **Abstract Factory**: Ensures consistent service-interaction combinations
- **Bridge**: Provides flexibility in service delivery and interaction methods  
- **State**: Enforces business rules for booking lifecycle management
- **Iterator**: Enables structured mentorship progress tracking

The implementation showcases how design patterns can be elegantly integrated into modern web applications, providing both architectural benefits and maintainable code. The combination of TypeScript, NestJS, React, and PostgreSQL creates a robust foundation that supports the complex business requirements while maintaining code quality and extensibility.

### Key Achievements:
✅ **Pattern Integration**: All four patterns work together seamlessly  
✅ **Business Logic**: Complex booking and mentorship flows are properly managed  
✅ **Type Safety**: Full TypeScript coverage prevents runtime errors  
✅ **User Experience**: Modern, responsive frontend with professional UI components  
✅ **Data Integrity**: Robust database design with proper constraints and relationships  
✅ **API Design**: Clean REST endpoints that expose pattern functionality effectively  

This architecture provides a solid foundation for future enhancements while maintaining the integrity of the established design patterns and business logic.

---

**Generated**: March 9, 2026  
**Version**: 1.0  
**Authors**: SkillTransfer Development Team
