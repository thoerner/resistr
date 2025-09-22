# Resist - Organizing Tool

A secure, privacy-focused platform for event coordination, resource tracking, and skill mapping. Built for organizers who need tools that work without compromising safety.

## 🎯 Features

### Event Hub
- Create and manage events with RSVP tracking
- Role-based coordination (medical, safety, logistics, general)
- Anonymous RSVP options
- Auto-generated flyers and QR codes
- Auto-purge after events (configurable, default 14 days)

### Resource Board
- Track what's needed vs. what's available
- Real-time updates and claiming system
- CSV export for offline coordination
- Categorized by type (medical, transportation, food, etc.)

### Skill Registry
- Opt-in skill mapping and registration
- Privacy-first contact methods (Signal, email, admin-only)
- Admin-managed skill matching
- Categories: Medical, Legal, Communication, Arts & Media, Technical, etc.

### Privacy & Security
- All data encrypted at rest with Supabase
- No tracking, analytics, or third-party data collection
- One-click manual purge for admins
- User-controlled data deletion
- Anonymous participation options

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd resist
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database schema:
   ```bash
   # Copy the contents of database-schema.sql and run in Supabase SQL editor
   ```

### 3. Configure Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Resist Organizing Tool"
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Components**: shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── events/            # Event management pages
│   ├── resources/         # Resource board pages
│   ├── skills/            # Skill registry pages
│   └── auth/              # Authentication callbacks
├── components/
│   ├── ui/                # shadcn/ui components
│   └── auth/              # Authentication components
└── lib/
    ├── supabase.ts        # Supabase client configuration
    └── utils.ts           # Utility functions
```

## 🔐 Security Features

### Data Protection
- Row Level Security (RLS) policies on all tables
- Encrypted data at rest via Supabase
- Minimal data collection policy
- Auto-purge functionality

### Privacy Controls
- Anonymous participation options
- Opt-in skill registration
- User-controlled data deletion
- No persistent logging

### Authentication
- Email/password authentication
- Magic link authentication
- Role-based access control (public, verified, admin)

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME="Resist Organizing Tool"
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🛠️ Development

### Database Schema
The complete database schema is in `database-schema.sql`. Key tables:
- `users` - User accounts and roles
- `events` - Event information and metadata
- `rsvps` - Event RSVPs and role assignments
- `resources` - Resource needs and availability
- `skills` - User skill registrations

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Add new components in `src/components/`
3. Update database schema if needed
4. Add RLS policies for new tables

### Testing
```bash
npm run build    # Test production build
npm run lint     # Run ESLint
```

## 📋 Roadmap

### Phase 2 (Post-MVP)
- [ ] Volunteer dashboard with shift management
- [ ] Broadcast system for updates
- [ ] Media library for resources
- [ ] Advanced admin controls
- [ ] Anonymous suggestion system

### Phase 3 (Long-term)
- [ ] Mobile app development
- [ ] Real-time chat integration
- [ ] Calendar synchronization
- [ ] Multi-language support
- [ ] API for third-party integrations

## 🤝 Contributing

This project is designed for community organizing and activism. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Important Notes

- This tool is designed for legitimate organizing and activism
- Always follow local laws and regulations
- Use secure communication methods (Signal, Matrix) for sensitive discussions
- Regularly purge data after events for security
- Keep backups of important data before purging

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review the database schema
3. Test with the development environment
4. Create an issue with detailed information

---

**Built with privacy and security in mind. No tracking. No data mining. Just tools that work.**
