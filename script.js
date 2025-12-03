// Sample data for team members and moderators
const teamMembers = [
    { name: "Antonio Goncalves", position: "Smart Contract Developer", image: "Core Team/antonio goncalves.jpg" },
    { name: "Austin", position: "CMO", image: "Core Team/Austin - CMO.jpg" },
    { name: "Ben Fielding", position: "Co-founder and CEO", image: "Core Team/Ben fielding- Co founder and CEO.jpg" },
    { name: "Emily", position: "Head of Talent", image: "Core Team/Emily - Head of Talent.jpg" },
    { name: "Frank Wan", position: "Finance", image: "Core Team/Frank wan - Finance.jpg" },
    { name: "Gab", position: "Researcher", image: "Core Team/Gab - Researcher.jpg" },
    { name: "Gef Amico", position: "COO", image: "Core Team/Gef amico - COO.jpg" },
    { name: "Harry", position: "Co-founder and COO", image: "Core Team/Harry - Co founder and COO.jpg" },
    { name: "Jesse Walker", position: "Technical Recruiter", image: "Core Team/Jesse walker - Technical recruiter.jpg" },
    { name: "Oguzhan Ersoy", position: "Researcher", image: "Core Team/Oguzhan Ersoy - Researcher.jpg" },
    { name: "Steve Glasper", position: "Brand", image: "Core Team/Steve Glasper - Brand.jpg" },
    { name: "Zang", position: "Researcher", image: "Core Team/Zang - Researcher.jpg" }
];

const moderators = [
    { name: "Blazy", position: "Moderator", image: "Moderators/Blazy - Moderator.jpg" },
    { name: "FabMac", position: "Moderator", image: "Moderators/FabMac - Moderator.jpg" },
    { name: "Gasoline", position: "Moderator", image: "Moderators/Gasoline - Moderator.jpg" },
    { name: "Jovar", position: "Moderator", image: "Moderators/Jovar - Moderator.jpg" },
    { name: "Kumo", position: "Moderator", image: "Moderators/Kumo - Moderator.jpg" },
    { name: "Samurai Kai", position: "Moderator", image: "Moderators/Samurai Kai - Moderator.jpg" },
    { name: "Sanjay", position: "Moderator", image: "Moderators/Sanjay - Moderator.jpg" },
    { name: "Sunny", position: "Moderator", image: "Moderators/Sunny - Moderator.jpg" },
    { name: "Xailong", position: "Moderator", image: "Moderators/Xailong - Moderator.jpg" }
];

// Store reviews and votes (now fetched from Supabase)
let reviews = [];
let votes = {};

// Initialize votes for each member if empty
async function initializeVotes() {
    try {
        // Fetch votes from Supabase
        votes = await window.GensynSupabase.fetchVotes();
        console.log('Fetched votes from Supabase:', votes);
    } catch (error) {
        console.log('Failed to fetch votes from Supabase, using empty object:', error);
        votes = {};
    }
    
    let initialized = false;
    [...teamMembers, ...moderators].forEach(member => {
        if (!(member.name in votes)) {
            votes[member.name] = 0;
            initialized = true;
        }
    });
    
    // If we initialized any votes, we should update the UI
    if (initialized) {
        updateVotingStats();
    }
}

// Function to create member cards
function createMemberCard(member, type) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.name = member.name;
    card.dataset.type = type;
    
    card.innerHTML = `
        <img src="${encodeURI(member.image)}" alt="${member.name}" class="member-image" onerror="this.onerror=null;this.src='https://placehold.co/300x250/E8D5C8/2A1E1A?text=${encodeURIComponent(member.name)}';" onclick="openMemberModal('${member.name}', '${type}')">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p>${member.position}</p>
        </div>
    `;
    
    return card;
}

// Function to populate team grid
function populateTeamGrid() {
    console.log('Populating team grid');
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) {
        console.error('Team grid element not found');
        return;
    }
    
    teamGrid.innerHTML = '';
    
    teamMembers.forEach(member => {
        const card = createMemberCard(member, 'team');
        teamGrid.appendChild(card);
    });
    console.log('Team grid populated with', teamMembers.length, 'members');
}

// Function to populate moderators grid
function populateModeratorsGrid() {
    console.log('Populating moderators grid');
    const moderatorsGrid = document.getElementById('moderatorsGrid');
    if (!moderatorsGrid) {
        console.error('Moderators grid element not found');
        return;
    }
    
    moderatorsGrid.innerHTML = '';
    
    moderators.forEach(moderator => {
        const card = createMemberCard(moderator, 'moderator');
        moderatorsGrid.appendChild(card);
    });
    console.log('Moderators grid populated with', moderators.length, 'moderators');
}

// Function to populate person's name dropdown based on review type
function populatePersonNameDropdown() {
    const revieweeType = document.getElementById('revieweeType').value;
    const revieweeNameSelect = document.getElementById('revieweeName');
    
    if (!revieweeNameSelect) {
        console.error('Reviewee name select element not found');
        return;
    }
    
    // Clear existing options
    revieweeNameSelect.innerHTML = '';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a person';
    revieweeNameSelect.appendChild(defaultOption);
    
    // Populate based on selected type
    if (revieweeType === 'team') {
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = `${member.name} (${member.position})`;
            revieweeNameSelect.appendChild(option);
        });
    } else if (revieweeType === 'moderator') {
        moderators.forEach(moderator => {
            const option = document.createElement('option');
            option.value = moderator.name;
            option.textContent = `${moderator.name} (${moderator.position})`;
            revieweeNameSelect.appendChild(option);
        });
    }
}

// Function to open member modal with reviews
function openMemberModal(name, type) {
    console.log('Opening modal for', name, type);
    // Display reviews for this member
    displayMemberReviews(name, type);
    
    // Show the modal
    const modal = document.getElementById('member-reviews-modal');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Scroll to the reviews section
    // document.getElementById('member-reviews-modal').scrollIntoView({ behavior: 'smooth' });
}

// Function to display reviews for a specific member
function displayMemberReviews(name, type) {
    const modal = document.getElementById('member-reviews-modal');
    const modalTitle = document.getElementById('modal-member-name');
    const reviewsContainer = document.getElementById('member-reviews-container');
    
    if (!modal || !modalTitle || !reviewsContainer) {
        console.error('Modal elements not found');
        return;
    }
    
    // Set the modal title
    modalTitle.textContent = `${name} - ${type === 'team' ? 'Team Member' : 'Moderator'}`;
    
    // Filter reviews for this member (handle both naming conventions)
    const memberReviews = reviews.filter(review => {
        const revieweeType = review.revieweeType || review.revieweetype || '';
        const revieweeName = review.revieweeName || review.revieweename || '';
        return revieweeName === name && revieweeType === type;
    });
    
    if (memberReviews.length === 0) {
        reviewsContainer.innerHTML = `<p>No feedback yet for this ${type === 'team' ? 'team member' : 'moderator'}.</p>`;
    } else {
        let reviewsHTML = '';
        memberReviews.forEach(review => {
            // Handle both camelCase and lowercase property names
            const title = review.title || '';
            const rating = review.rating || 0;
            const text = review.text || '';
            const reviewerName = review.reviewerName || review.reviewername || 'Anonymous';
            const date = review.date || '';
            
            reviewsHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <h4>${title}</h4>
                        <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                    </div>
                    <div class="review-content">
                        <p>${text}</p>
                    </div>
                    <div class="review-footer">
                        <span class="reviewer">${reviewerName}</span>
                        <span class="review-date">${date}</span>
                    </div>
                </div>
            `;
        });
        reviewsContainer.innerHTML = reviewsHTML;
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Function to close the member reviews modal
function closeMemberModal() {
    const modal = document.getElementById('member-reviews-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to open review modal for submitting new review
function openReviewModal(name, type) {
    const revieweeName = document.getElementById('revieweeName');
    const revieweeType = document.getElementById('revieweeType');
    
    if (revieweeName) revieweeName.value = name;
    if (revieweeType) revieweeType.value = type;
    
    // Scroll to the review form
    const reviewForm = document.getElementById('submit-review');
    if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to display all reviews
function displayReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;
    
    // Debug: Log current reviews
    console.log('Displaying reviews:', reviews);
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No feedback yet. Be the first to share your experience!</p>';
        return;
    }
    
    let reviewsHTML = '<h3>Community Feedback</h3>';
    reviews.forEach(review => {
        // Handle both camelCase and lowercase property names
        const revieweeType = review.revieweeType || review.revieweetype || '';
        const revieweeName = review.revieweeName || review.revieweename || '';
        const title = review.title || '';
        const rating = review.rating || 0;
        const text = review.text || '';
        const reviewerName = review.reviewerName || review.reviewername || 'Anonymous';
        const date = review.date || '';
        
        reviewsHTML += `
            <div class="review-item">
                <div class="review-header">
                    <h4>${title}</h4>
                    <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                </div>
                <div class="review-content">
                    <p>${text}</p>
                </div>
                <div class="review-footer">
                    <span class="reviewer">${reviewerName}</span>
                    <span class="review-date">${date}</span>
                    <span class="review-subject">${revieweeType === 'team' ? 'Team Member' : 'Moderator'}: ${revieweeName}</span>
                </div>
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHTML;
}

// Function to populate voting candidates
function populateVotingCandidates() {
    console.log('Populating voting candidates');
    const voteCandidate = document.getElementById('voteCandidate');
    if (!voteCandidate) {
        console.error('Vote candidate element not found');
        return;
    }
    
    voteCandidate.innerHTML = '';
    
    // Populate with team members first
    const teamOptGroup = document.createElement('optgroup');
    teamOptGroup.label = 'Core Team Members';
    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = `${member.name} (${member.position})`;
        teamOptGroup.appendChild(option);
    });
    voteCandidate.appendChild(teamOptGroup);
    
    // Then populate with moderators
    const modOptGroup = document.createElement('optgroup');
    modOptGroup.label = 'Moderators';
    moderators.forEach(mod => {
        const option = document.createElement('option');
        option.value = mod.name;
        option.textContent = `${mod.name} (${mod.position})`;
        modOptGroup.appendChild(option);
    });
    voteCandidate.appendChild(modOptGroup);
    console.log('Voting candidates populated');
}

// Function to update voting statistics
function updateVotingStats() {
    const statsContainer = document.getElementById('votingStatsContainer');
    if (!statsContainer) {
        console.error('Voting stats container not found');
        return;
    }
    
    // Debug: Log current votes
    console.log('Updating voting stats with votes:', votes);
    
    // Get top 5 candidates by votes
    const sortedCandidates = Object.entries(votes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    if (sortedCandidates.length === 0) {
        statsContainer.innerHTML = '<p>No votes recorded yet.</p>';
        return;
    }
    
    let statsHTML = '<div class="stats-grid">';
    sortedCandidates.forEach(([name, voteCount]) => {
        statsHTML += `
            <div class="stat-card">
                <div class="stat-name">${name}</div>
                <div class="stat-votes">${voteCount} votes</div>
            </div>
        `;
    });
    statsHTML += '</div>';
    
    statsContainer.innerHTML = statsHTML;
    
    // Update the top performer display
    const topPerformer = sortedCandidates[0];
    if (topPerformer) {
        const [name, voteCount] = topPerformer;
        
        // Find the person's details
        const person = [...teamMembers, ...moderators].find(p => p.name === name);
        
        if (person) {
            const topPerformerName = document.getElementById('topPerformerName');
            const topPerformerPosition = document.getElementById('topPerformerPosition');
            const topPerformerVotes = document.getElementById('topPerformerVotes');
            const topPerformerImage = document.getElementById('topPerformerImage');
            
            if (topPerformerName) topPerformerName.textContent = name;
            if (topPerformerPosition) topPerformerPosition.textContent = person.position;
            if (topPerformerVotes) topPerformerVotes.textContent = voteCount;
            if (topPerformerImage) topPerformerImage.src = person.image;
        }
    }
}

// Function to cast a vote
async function castVote() {
    const voterName = document.getElementById('voterName').value.trim();
    const candidateName = document.getElementById('voteCandidate').value;
    
    if (!voterName) {
        alert('Please enter your Discord/Twitter username');
        return;
    }
    
    if (!candidateName) {
        alert('Please select a candidate');
        return;
    }
    
    try {
        // Update vote in Supabase
        const success = await window.GensynSupabase.updateVote(candidateName);
        
        if (success) {
            // Update local votes object
            votes[candidateName] = (votes[candidateName] || 0) + 1;
            
            // Update the UI
            updateVotingStats();
            
            // Show confirmation
            alert(`Thank you for voting for ${candidateName}! Your community voice matters.`);
            
            // Clear the voter name field
            const voterNameElement = document.getElementById('voterName');
            if (voterNameElement) voterNameElement.value = '';
        } else {
            alert('There was an error recording your vote. Please try again.');
        }
    } catch (error) {
        console.error('Error casting vote:', error);
        alert('There was an error recording your vote. Please try again.');
    }
}

// Initialize the application
async function initApp() {
    console.log('Initializing App');
    
    try {
        // Fetch reviews and votes from Supabase
        console.log('Fetching reviews from Supabase...');
        reviews = await window.GensynSupabase.fetchReviews();
        console.log('Fetched reviews:', reviews);
    } catch (error) {
        console.log('Failed to fetch reviews from Supabase, using empty array:', error);
        reviews = [];
    }
    
    try {
        await initializeVotes();
    } catch (error) {
        console.log('Failed to initialize votes:', error);
    }
    
    // Populate voting candidates
    try {
        console.log('Populating voting candidates');
        populateVotingCandidates();
    } catch (error) {
        console.error('Failed to populate voting candidates:', error);
    }
    
    // Initialize voting stats
    try {
        console.log('Updating voting stats');
        updateVotingStats();
    } catch (error) {
        console.error('Failed to update voting stats:', error);
    }
    
    // Display existing reviews
    try {
        console.log('Displaying reviews');
        displayReviews();
    } catch (error) {
        console.error('Failed to display reviews:', error);
    }
    
    // Populate grids when page loads
    try {
        console.log('Populating team grid');
        populateTeamGrid();
    } catch (error) {
        console.error('Failed to populate team grid:', error);
    }
    
    try {
        console.log('Populating moderators grid');
        populateModeratorsGrid();
    } catch (error) {
        console.error('Failed to populate moderators grid:', error);
    }
    
    console.log('App Initialization Complete');
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');
    
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        initApp();
    }, 100);
    
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');
    
    if (!stars.length) {
        console.error('No star elements found');
    }
    
    if (!ratingInput) {
        console.error('Rating input element not found');
    }
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            if (ratingInput) ratingInput.value = rating;
            
            // Update star appearance
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = 'rgba(212, 185, 163, 0.4)';
                }
            });
        });
    });
    
    // Reset star appearance on mouseout
    const ratingElement = document.querySelector('.rating');
    if (ratingElement) {
        ratingElement.addEventListener('mouseleave', function() {
            const currentRating = ratingInput ? ratingInput.value : null;
            
            stars.forEach(star => {
                const starRating = star.getAttribute('data-rating');
                if (currentRating && starRating <= currentRating) {
                    star.classList.add('active');
                    star.style.color = '#FFD700';
                } else {
                    star.classList.remove('active');
                    star.style.color = 'rgba(212, 185, 163, 0.4)';
                }
            });
        });
    }
    
    // Form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const revieweeType = document.getElementById('revieweeType').value;
            const revieweeName = document.getElementById('revieweeName').value;
            const reviewTitle = document.getElementById('reviewTitle').value;
            const reviewRating = document.getElementById('reviewRating').value;
            const reviewText = document.getElementById('reviewText').value;
            const reviewerName = document.getElementById('reviewerName').value || 'Anonymous';
            
            // Validate rating
            if (!reviewRating) {
                alert('Please select a rating');
                return;
            }
            
            // Validate person name
            if (!revieweeName) {
                alert('Please select a person to review');
                return;
            }
            
            // Create review object
            const review = {
                revieweeType: revieweeType,
                revieweeName: revieweeName,
                title: reviewTitle,
                rating: parseInt(reviewRating),
                text: reviewText,
                reviewerName: reviewerName,
                date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD for SQL DATE type
            };
            
            try {
                // Add review to Supabase
                const addedReview = await window.GensynSupabase.addReview(review);
                
                if (addedReview) {
                    // Add to local reviews array (handle both naming conventions)
                    const reviewToAdd = {
                        revieweeType: addedReview.revieweeType || addedReview.revieweetype || review.revieweeType,
                        revieweeName: addedReview.revieweeName || addedReview.revieweename || review.revieweeName,
                        title: addedReview.title || review.title,
                        rating: addedReview.rating || review.rating,
                        text: addedReview.text || review.text,
                        reviewerName: addedReview.reviewerName || addedReview.reviewername || review.reviewerName,
                        date: addedReview.date || review.date,
                        created_at: addedReview.created_at || new Date().toISOString()
                    };
                            
                    reviews.push(reviewToAdd);
                            
                    // Display reviews
                    displayReviews();
                            
                    // Show success message
                    alert(`Thank you for sharing your experience!\n\nYour feedback helps improve our community.`);
                            
                    // Reset form
                    reviewForm.reset();
                            
                    // Reset stars
                    stars.forEach(star => {
                        star.classList.remove('active');
                        star.style.color = 'rgba(212, 185, 163, 0.4)';
                    });
                            
                    // Reset person name dropdown
                    const revieweeNameElement = document.getElementById('revieweeName');
                    if (revieweeNameElement) {
                        revieweeNameElement.innerHTML = '<option value="">Select a person after choosing review type</option>';
                    }
                } else {
                    alert('There was an error submitting your review. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('There was an error submitting your review. Please try again.');
            }
        });
    }
    
    // Add event listener to review type dropdown
    const revieweeTypeElement = document.getElementById('revieweeType');
    if (revieweeTypeElement) {
        revieweeTypeElement.addEventListener('change', populatePersonNameDropdown);
    }
    
    // Voting functionality
    const castVoteBtn = document.getElementById('castVoteBtn');
    if (castVoteBtn) {
        castVoteBtn.addEventListener('click', castVote);
    }
    
    // Close modal when clicking on the close button
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closeMemberModal);
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('member-reviews-modal');
        if (event.target === modal) {
            closeMemberModal();
        }
    });
});