# Resistr - Organizing Tool

A secure, privacy-focused platform for event coordination, resource tracking, and skill mapping. Built for organizers who need tools that work without compromising safety.

## 🎯 Features

### Actions Management
- Create and manage actions/events with comprehensive tracking
- Role-based coordination (medical, safety, logistics, general)
- Anonymous participation options
- Real-time updates and status tracking
- Auto-purge after events (configurable, default 14 days)
- Action categorization and filtering

### Resource Board
- Track what's needed vs. what's available
- Real-time updates and claiming system
- CSV export for offline coordination
- Categorized by type (medical, transportation, food, etc.)
- Resource status tracking and management

### Skill Registry
- Opt-in skill mapping and registration
- Privacy-first contact methods (Signal, email, admin-only)
- Admin-managed skill matching
- Categories: Medical, Legal, Communication, Arts & Media, Technical, etc.
- Skill availability and expertise level tracking

### Admin Dashboard
- Comprehensive user management system
- System settings and configuration
- Data management and export tools
- Role-based access control
- System monitoring and analytics

### User Guide & Documentation
- Built-in help system and user guide
- Feature explanations and best practices
- Privacy and security guidelines
- Getting started tutorials

### Privacy & Security
- All data encrypted at rest with Supabase
- No tracking, analytics, or third-party data collection
- One-click manual purge for admins
- User-controlled data deletion
- Anonymous participation options
- Row Level Security (RLS) policies on all data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone https://github.com/thoerner/resistr.git 
cd resistr
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
NEXT_PUBLIC_APP_NAME="Resistr Organizing Tool"
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
│   ├── actions/           # Actions/events management pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages and callbacks
│   ├── guide/             # User guide and documentation
│   ├── resources/         # Resource board pages
│   ├── skills/            # Skill registry pages
│   └── layout.tsx         # Root layout with auth provider
├── components/
│   ├── actions/           # Actions-related components
│   ├── admin/             # Admin dashboard components
│   ├── auth/              # Authentication components
│   ├── resources/         # Resource management components
│   ├── skills/            # Skills management components
│   ├── ui/                # shadcn/ui components
│   └── animated-hero.tsx  # Animated hero component
├── hooks/                 # Custom React hooks
│   ├── use-actions.ts     # Actions data management
│   ├── use-admin.ts       # Admin functionality
│   ├── use-resources.ts   # Resources data management
│   ├── use-skills.ts      # Skills data management
│   ├── use-users.ts       # User management
│   └── use-system-*.ts    # System settings and data
└── lib/
    ├── supabase.ts        # Supabase client configuration
    ├── user-display.ts    # User display utilities
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
- Secure session management
- User profile management

## 👨‍💼 Admin Features

### User Management
- View and manage all user accounts
- Assign and modify user roles (public, verified, admin)
- User activity monitoring
- Account status management

### System Settings
- Configure system-wide settings
- Manage feature flags and toggles
- System health monitoring
- Database maintenance tools

### Data Management
- Export user data and system information
- Data backup and restore capabilities
- Manual data purge functionality
- System analytics and reporting

### Security Controls
- Access log monitoring
- Security policy enforcement
- Data retention management
- Privacy compliance tools

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
NEXT_PUBLIC_APP_NAME="Resistr Organizing Tool"
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🛠️ Development

### Database Schema
The complete database schema is in `database-schema.sql`. Key tables:
- `users` - User accounts and roles (public, verified, admin)
- `events` - Event/action information and metadata
- `rsvps` - Event RSVPs and role assignments
- `resources` - Resource needs and availability tracking
- `skills` - User skill registrations and contact methods

The schema includes:
- Row Level Security (RLS) policies for data protection
- Automatic timestamp tracking with triggers
- UUID primary keys for security
- Proper foreign key relationships
- Indexes for optimal query performance

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Add new components in `src/components/`
3. Create custom hooks in `src/hooks/` for data management
4. Update database schema if needed
5. Add RLS policies for new tables
6. Update the admin dashboard if needed

### Development Patterns
- **Custom Hooks**: Use the established pattern in `src/hooks/` for data management
- **Component Structure**: Follow the component organization in `src/components/`
- **Type Safety**: Maintain TypeScript throughout the codebase
- **Security First**: Always implement proper RLS policies for new data
- **Admin Integration**: Ensure new features integrate with admin dashboard when appropriate

### Testing
```bash
npm run build    # Test production build
npm run lint     # Run ESLint
```

## 📋 Roadmap

### ✅ Completed Features (v0.1.0)
- [x] Actions/Events management system
- [x] Resource tracking and management
- [x] Skills registry and mapping
- [x] Admin dashboard with user management
- [x] Built-in user guide and documentation
- [x] Enhanced authentication system
- [x] Row Level Security (RLS) implementation
- [x] Comprehensive UI component library

### Phase 2 (Current Development)
- [ ] Real-time notifications system
- [ ] Advanced action templates
- [ ] Resource sharing and collaboration features
- [ ] Enhanced admin analytics and reporting
- [ ] Mobile-responsive improvements

### Phase 3 (Long-term)
- [ ] Mobile app development (React Native)
- [ ] Real-time chat integration
- [ ] Calendar synchronization
- [ ] Advanced export/import features
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Offline capability

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
