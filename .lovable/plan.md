

# Newomen Platform - Complete Implementation Plan

## Overview
A production-ready voice-first AI self-discovery and transformation platform featuring the NewMe astrological psychology voice agent, events/ticketing, membership management, and an AI-powered admin panel.

---

## Phase 1: MVP Foundation

### 1.1 Design System & Core UI
- **Glassmorphic design system** using shadcn/ui + Glass UI effects
- Pastel gradient palette (purple → pink → teal → gold) matching your logo
- Dark/light mode with smooth particle backgrounds
- Mobile-first responsive layouts
- Logo integration in navbar and footer (swappable container)

### 1.2 Public Landing Experience
- Hero section with NewMe introduction and voice demo CTA
- **Upcoming Events** carousel with booking CTAs
- **Previous Events Gallery** with images and experiences
- **Free Assessments** section (5-6 psychology quizzes)
- Membership tier comparison (Discovery/Growth/Transformation)
- Testimonials and social proof

### 1.3 Authentication & Onboarding
- Sign up / Sign in with email
- **Mandatory onboarding flow:**
  - Language & cultural preferences
  - Nickname selection
  - Date of birth (with explanation of astrological psychology benefits)
  - 10-question deep psychological assessment
  - Intensity preference: Soft / Direct / No Mercy
  - Consent & memory preferences
- Initial psychological pattern summary generation

### 1.4 User Dashboard
- Daily insight/provocation from NewMe
- Minutes remaining indicator (for voice sessions)
- Progress indicators and journey status
- "Speak with NewMe" primary CTA
- Featured upcoming event
- Recent memory highlight ("You said X last week...")

### 1.5 Voice Chat Interface (Core)
- **Push-to-talk voice interaction** with ElevenLabs
- Text fallback mode
- Live transcript display
- Session summary on completion
- Intensity toggle (Soft/Direct/No Mercy)
- Stop words handling: "Pause", "Ground", "Switch tone", "Stop memory"
- Per-message memory controls: Save / Don't save / Delete

### 1.6 Events System
- Event listing with search and filters
- Event detail pages (description, date, capacity, price, gallery)
- **Two CTAs per event:**
  - "Buy Single Ticket" → Payment flow
  - "Become a Member" → Lead capture form (Full Name, WhatsApp)
- Ticket confirmation page and notifications
- Payment failure fallback with WhatsApp support (510522089)
- Member free access for Transformation tier events

### 1.7 Subscription & Billing (PayPal)
- **Discovery**: Free tier with limited features
- **Growth**: $22/month with premium access
- **Transformation**: $222/month - all-inclusive with free events
- PayPal recurring payment integration
- Webhook handling for renewals/cancellations
- Usage tracking per voice session second
- Hard stop or text-only when minutes exhausted

### 1.8 User Profile
- Personal info and preferences
- Current status display:
  - Active Member (tier + renewal date) OR
  - Event Ticket Holder (event name, date, status)
- Memory management and consent settings
- Assessment history and results

### 1.9 Admin Panel (Core)
- **Analytics Dashboard**: DAU/WAU/MAU, voice usage, conversions, revenue
- **Events Management**: Create/edit/publish, capacity, pricing, member access toggle
- **Event Galleries**: Upload images and experiences from past events
- **Membership Leads**: View and manage WhatsApp form submissions
- **User Management**: View users, subscriptions, session history
- **AI Configuration**: Model selection, prompt versioning, safety constraints

---

## Phase 2: Enhanced Features

### 2.1 Assessments Engine (Full)
- **Visitor assessments** (5-6 free, 10-15 questions each)
- **Authenticated assessments** (20 advanced, 15-20 questions each)
- AI-led delivery and real-time evaluation
- Personalized results with follow-up prompts
- Results saved to memory with consent
- Admin toggle: visitor-access vs authenticated-only

### 2.2 AI Assessment Builder
- Admin inputs topic, audience, depth level
- AI generates: questions, scoring logic, result narratives, follow-up prompts
- Edit, publish, archive, version history

### 2.3 Wellness Library
- Audio-only content player
- YouTube embedded (wrapped UI)
- Categorization, favorites, completion tracking
- Admin content management

### 2.4 Admin AI Agent (CMS Operator)
- Conversational interface for admin operations
- **CRUD capabilities**: Events, assessments, resources, galleries, FAQs
- **Frontend configuration**: Homepage sections, ordering, CTAs, theme tokens
- Preview/confirm flow for all changes
- Audit logging for every action
- Permission-scoped (admin vs super-admin)
- Destructive action confirmations required

### 2.5 Branding & Theme Management
- Logo upload slot (your logo integrated)
- Theme tokens editor (accent colors, surface intensity)
- Particle intensity settings (low/medium/high)
- Reduce motion accessibility option

---

## Phase 3: Community & Advanced

### 3.1 Community Features
- User profiles with avatars
- Circles and transformation journeys
- Posts, comments, event discussions
- Moderation tools and reporting

### 3.2 Couple's Challenge
- Invite link generation
- Guest join without account
- AI-led compatibility assessment
- Shared results narrative
- Save to inviter's profile (with consent)

### 3.3 Advanced Admin AI
- Community moderation assistance
- Campaign suggestions based on retention data
- Automated content recommendations
- Multi-agent expansion preparation

---

## Technical Architecture

### Backend (Lovable Cloud)
- User authentication and session management
- Subscription and payment processing (PayPal webhooks)
- Event bookings and ticket management
- Memory storage with consent controls
- Assessment results and pattern detection
- Admin audit logging

### Voice AI (ElevenLabs)
- Speech-to-speech conversational agent
- NewMe persona with intensity profiles
- Stop word detection and response
- Session transcription and summaries

### AI Services (Lovable AI)
- Admin AI agent for CMS operations
- Assessment generation and evaluation
- Memory pattern recognition
- Daily insight generation

### Data Model
- Users, preferences, subscriptions
- Sessions, messages, memories
- Assessments, questions, results
- Events, bookings, galleries
- Membership leads
- Admin audit logs, AI actions
- Page sections, theme tokens, content versions

---

## NewMe Agent Personality

**Identity**: Astrological psychologist - declarative, precise, provocative

**Behaviors**:
- Uses zodiac archetypes as psychological lenses
- Integrates memory across sessions ("You said X last week...")
- Tracks patterns and confronts inconsistencies
- Respects intensity dial and stop words
- Asks for daily "glimmer" photos and references them later

**Prohibited**: Dependency framing, humiliation, medical claims, coercive language

---

## Safety & Compliance

- Stop word handling with immediate response changes
- Memory consent controls (save/delete per message)
- Admin session review with audit logging
- Escalation paths for concerning content
- Privacy-first design with data deletion options

