-- Create reviews table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  revieweeType VARCHAR(50) NOT NULL,
  revieweeName VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  reviewerName VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  person_name VARCHAR(100) NOT NULL UNIQUE,
  vote_count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial team members and moderators into votes table with 0 votes
-- Only insert if the person doesn't already exist
INSERT INTO votes (person_name, vote_count) 
SELECT 'Antonio Goncalves', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Antonio Goncalves');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Austin', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Austin');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Ben Fielding', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Ben Fielding');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Emily', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Emily');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Frank Wan', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Frank Wan');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Gab', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Gab');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Gef Amico', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Gef Amico');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Harry', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Harry');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Jesse Walker', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Jesse Walker');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Oguzhan Ersoy', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Oguzhan Ersoy');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Steve Glasper', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Steve Glasper');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Zang', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Zang');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Blazy', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Blazy');

INSERT INTO votes (person_name, vote_count) 
SELECT 'FabMac', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'FabMac');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Gasoline', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Gasoline');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Jovar', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Jovar');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Kumo', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Kumo');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Samurai Kai', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Samurai Kai');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Sanjay', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Sanjay');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Sunny', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Sunny');

INSERT INTO votes (person_name, vote_count) 
SELECT 'Xailong', 0
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE person_name = 'Xailong');