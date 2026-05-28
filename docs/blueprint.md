# **App Name**: EDUGO

## Core Features:

- Intelligent RFID Monitoring: A local background service tool that processes serial RFID scans to cross-reference timetable data for automatic attendance marking.
- AI Crowd Analytics: Leverages the P2Net tool powered by NVIDIA GPU to perform crowd density inference and count classroom attendance via computer vision at specific timetable triggers.
- Live Attendance Dashboards: Multi-role interface for HODs, Faculty, and Students to monitor real-time class status, counts, and scan histories via WebSocket.
- Dynamic Spreadsheet Sync: Background synchronization that maps local PostgreSQL attendance records to subject-specific Google Sheets in real-time.
- Leave and Messaging Workflow: Automated system for student leave applications and faculty-initiated push notifications using a tool to check compliance thresholds.
- Automated Scheduler Engine: Configurable scheduling system that automates session transitions, snapshot triggers, and 11 PM status notifications.
- Unified Class Management: Comprehensive HOD control panel for faculty assignment, subject management, and student enrollment verification.

## Style Guidelines:

- Dark-mode industrial palette: Primary Cobalt (#4C5FD5), Deep Navy Background (#0F1116), and Electric Cyan Accent (#3FB2D0).
- A tech-forward pairing of 'Space Grotesk' for high-precision headlines and 'Inter' for highly readable body text and data grids.
- Clean, stroke-based architectural icons with consistent 2px weights and no decorative embellishments or emojis.
- Highly structured sidebar-navigation for dashboards with density-focused data tables and charts using Recharts for performance metrics.
- Zero-latency status indicators and subtle slide-in micro-interactions for live notification updates and real-time scanning events.