# Gensyn Community Reviews Platform

A website for the Gensyn community to submit reviews and vote for team members and moderators.

## Features

- View all Gensyn team members and moderators
- Submit reviews for team members and moderators
- Vote for the top performer of the week
- View all community feedback
- Persistent data storage using Supabase

## Setup Instructions

### Prerequisites

1. Node.js installed
2. A Supabase account (free tier available at https://supabase.com/)

### Installation

1. Clone or download this repository
2. Install the required dependencies:
   ```
   npm install @supabase/supabase-js
   ```

### Supabase Configuration

The Supabase configuration is already set up with your project credentials:
- Project URL: https://pdhehczqtdszltszuudk.supabase.co
- Public Key: sb_publishable_4Eq6DOCfHmqP_9NJriYAiA_ffv_sXGy

### Database Setup

1. In your Supabase project, go to the SQL editor
2. Run the SQL commands from `supabase-migration.sql` to create the necessary tables:
   - `reviews` table for storing community reviews
   - `votes` table for storing voting data

Alternatively, you can read the detailed instructions in `instructions.txt` which contains the exact SQL commands to run.

### Running the Application

Simply open `index.html` in a web browser, or use the development server:
```
npm start
```

Then visit http://localhost:52119 (or the URL shown in the terminal)

## How It Works

- All reviews and votes are stored in Supabase, making them accessible to all users
- When a user submits a review, it's saved to the Supabase database
- When a user casts a vote, the vote count is updated in the database
- Data is fetched from Supabase when the page loads, ensuring all users see the same information

## Customization

You can customize the color scheme by modifying the CSS variables in `styles.css`:
- `--beige`: Main text/content color
- `--brown`: Background color
- `--accent`: Accent color for borders and highlights

## Troubleshooting

If you encounter issues:
1. Check that your Supabase project URL and anon key are correct
2. Ensure the database tables have been created
3. Check the browser console for any error messages
4. Verify that your Supabase project has the correct Row Level Security (RLS) settings

## Contributing

Feel free to fork this repository and submit pull requests with improvements.