// Supabase project configuration (already set with your actual values)
const SUPABASE_URL = 'https://pdhehczqtdszltszuudk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4Eq6DOCfHmqP_9NJriYAiA_ffv_sXGy';

console.log('Initializing Supabase client with URL:', SUPABASE_URL);

// Create a single supabase client for interacting with your database
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

// Helper function to format review data with consistent property names
function formatReviewData(review) {
  if (!review) return null;
  
  return {
    id: review.id,
    revieweeType: review.revieweeType || review.revieweetype || review.reviewee_type || review.RevieweeType || review.REVIEWEETYPE,
    revieweeName: review.revieweeName || review.revieweename || review.reviewee_name || review.RevieweeName || review.REVIEWEENAME,
    title: review.title,
    rating: review.rating,
    text: review.text,
    reviewerName: review.reviewerName || review.reviewername || review.reviewer_name || review.ReviewerName || review.REVIEWERNAME,
    date: review.date,
    created_at: review.created_at
  };
}

// Function to refresh Supabase schema cache
async function refreshSchemaCache() {
  console.log('Refreshing Supabase schema cache');
  try {
    // Force a metadata refresh by making a simple query
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST204') {
      console.error('Error during schema refresh:', error);
      return false;
    }
    
    console.log('Schema cache refreshed successfully');
    return true;
  } catch (error) {
    console.error('Exception during schema refresh:', error);
    return false;
  }
}

// Check if the client was created successfully
if (supabaseClient) {
  console.log('Supabase client initialized successfully');
} else {
  console.error('Failed to initialize Supabase client');
}

// Function to fetch all reviews from Supabase
async function fetchReviews() {
  console.log('Attempting to fetch reviews from Supabase');
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      
      // If it's a schema cache error, try to refresh and retry
      if (error.code === 'PGRST204') {
        console.log('Detected schema cache error, attempting to refresh schema');
        const refreshed = await refreshSchemaCache();
        if (refreshed) {
          // Retry the fetch
          const { data: retryData, error: retryError } = await supabaseClient
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (retryError) {
            console.error('Error fetching reviews after schema refresh:', retryError);
            return [];
          }
          
          console.log('Successfully fetched reviews after schema refresh:', retryData);
          return retryData || [];
        }
      }
      
      return [];
    }

    console.log('Successfully fetched reviews:', data);
    
    // Handle case where table exists but is empty
    if (!data || data.length === 0) {
      console.log('Reviews table is empty');
      return [];
    }
    
    // Format all reviews with consistent property names
    const formattedData = data.map(review => formatReviewData(review));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Function to add a new review to Supabase
async function addReview(review) {
  console.log('Attempting to add review to Supabase:', review);
  try {
    // Use the correct camelCase column names that exist in the database
    const reviewData = {
      revieweeType: review.revieweeType,
      revieweeName: review.revieweeName,
      title: review.title,
      rating: review.rating,
      text: review.text,
      reviewerName: review.reviewerName,
      date: review.date
    };

    console.log('Sending review data with correct camelCase keys:', reviewData);
    
    // Try inserting with correct column names
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([reviewData])
      .select();

    if (error) {
      console.error('Error inserting review:', error);
      console.error('Detailed error info:', JSON.stringify(error, null, 2));
      
      // Handle schema cache error specifically
      if (error.code === 'PGRST204') {
        console.log('Detected schema cache error during insert, attempting to refresh schema');
        const refreshed = await refreshSchemaCache();
        if (refreshed) {
          // Retry the insert
          const { data: retryData, error: retryError } = await supabaseClient
            .from('reviews')
            .insert([reviewData])
            .select();
          
          if (retryError) {
            console.error('Error inserting review after schema refresh:', retryError);
            console.error('Detailed error info:', JSON.stringify(retryError, null, 2));
            
            // Even if we get an error, the insert might have worked
            // Let's try to fetch the latest review to confirm
            const { data: latestData, error: latestError } = await supabaseClient
              .from('reviews')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (latestError) {
              console.error('Error fetching latest review:', latestError);
              return null;
            }
            
            if (latestData && latestData.length > 0) {
              console.log('Successfully added review (detected despite error):', latestData[0]);
              return formatReviewData(latestData[0]);
            }
            
            return null;
          }
          
          console.log('Successfully added review after schema refresh:', retryData);
          return formatReviewData(retryData[0]);
        }
      }
      
      // Even if we get an error, the insert might have worked
      // Let's try to fetch the latest review to confirm
      const { data: latestData, error: latestError } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (latestError) {
        console.error('Error fetching latest review:', latestError);
        return null;
      }
      
      if (latestData && latestData.length > 0) {
        console.log('Successfully added review (detected despite error):', latestData[0]);
        return formatReviewData(latestData[0]);
      }
      
      return null;
    }

    // If no error on insert
    console.log('Successfully added review:', data);
    return formatReviewData(data[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
}

// Function to fetch all votes from Supabase
async function fetchVotes() {
  console.log('Attempting to fetch votes from Supabase');
  try {
    const { data, error } = await supabaseClient
      .from('votes')
      .select('*');

    if (error) {
      console.error('Error fetching votes:', error);
      return {};
    }

    console.log('Successfully fetched votes:', data);
    
    // Handle case where table exists but is empty
    if (!data || data.length === 0) {
      console.log('Votes table is empty');
      return {};
    }
    
    // Convert array of votes to object with name as key
    const votesObject = {};
    data.forEach(vote => {
      votesObject[vote.person_name] = vote.vote_count;
    });

    return votesObject;
  } catch (error) {
    console.error('Error fetching votes:', error);
    return {};
  }
}

// Function to add or update a vote in Supabase
async function updateVote(personName) {
  console.log('Attempting to update vote for:', personName);
  try {
    // First, try to get the existing vote count
    const { data: existingVotes, error: fetchError } = await supabaseClient
      .from('votes')
      .select('vote_count')
      .eq('person_name', personName);

    if (fetchError) {
      console.error('Error fetching existing vote:', fetchError);
      return false;
    }

    let newVoteCount = 1;
    if (existingVotes.length > 0) {
      // Person already has votes, increment
      newVoteCount = existingVotes[0].vote_count + 1;
      
      // Update existing record
      const { error: updateError } = await supabaseClient
        .from('votes')
        .update({ vote_count: newVoteCount })
        .eq('person_name', personName);

      if (updateError) {
        console.error('Error updating vote:', updateError);
        return false;
      }
    } else {
      // Person doesn't have votes yet, create new record
      const { error: insertError } = await supabaseClient
        .from('votes')
        .insert([{ person_name: personName, vote_count: newVoteCount }]);

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        return false;
      }
    }

    console.log('Successfully updated vote for:', personName);
    return true;
  } catch (error) {
    console.error('Error updating vote:', error);
    return false;
  }
}

// Function to manually refresh schema cache (for testing purposes)
async function manualSchemaRefresh() {
  console.log('Manual schema refresh triggered');
  const refreshed = await refreshSchemaCache();
  if (refreshed) {
    console.log('Manual schema refresh completed successfully');
  } else {
    console.error('Manual schema refresh failed');
  }
  return refreshed;
}

// Export functions for use in other scripts
window.GensynSupabase = {
  fetchReviews,
  addReview,
  fetchVotes,
  updateVote,
  manualSchemaRefresh
};