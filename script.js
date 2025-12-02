// Sample data for team members and moderators
const teamMembers = [
    { name: "Antonio Goncalves", position: "Smart Contract Developer", image: "Core%20Team/antonio%20goncalves.jpg" },
    { name: "Austin", position: "CMO", image: "Core%20Team/Austin%20-%20CMO.jpg" },
    { name: "Ben Fielding", position: "Co-founder and CEO", image: "Core%20Team/Ben%20fielding-%20Co%20founder%20and%20CEO.jpg" },
    { name: "Emily", position: "Head of Talent", image: "Core%20Team/Emily%20-%20Head%20of%20Talent.jpg" },
    { name: "Frank Wan", position: "Finance", image: "Core%20Team/Frank%20wan%20-%20Finance.jpg" },
    { name: "Gab", position: "Researcher", image: "Core%20Team/Gab%20-%20Researcher.jpg" },
    { name: "Gef Amico", position: "COO", image: "Core%20Team/Gef%20amico%20-%20COO.jpg" },
    { name: "Harry", position: "Co-founder and COO", image: "Core%20Team/Harry%20-%20Co%20founder%20and%20COO.jpg" },
    { name: "Jesse Walker", position: "Technical Recruiter", image: "Core%20Team/Jesse%20walker%20-%20Technical%20recruiter.jpg" },
    { name: "Oguzhan Ersoy", position: "Researcher", image: "Core%20Team/Oguzhan%20Ersoy%20-%20Researcher.jpg" },
    { name: "Steve Glasper", position: "Brand", image: "Core%20Team/Steve%20Glasper%20-%20Brand.jpg" },
    { name: "Zang", position: "Researcher", image: "Core%20Team/Zang%20-%20Researcher.jpg" }
];

const moderators = [
    { name: "Blazy", position: "Moderator", image: "Moderators/Blazy%20-%20Moderator.jpg" },
    { name: "FabMac", position: "Moderator", image: "Moderators/FabMac%20-%20Moderator.jpg" },
    { name: "Gasoline", position: "Moderator", image: "Moderators/Gasoline%20-%20Moderator.jpg" },
    { name: "Jovar", position: "Moderator", image: "Moderators/Jovar%20-%20Moderator.jpg" },
    { name: "Kumo", position: "Moderator", image: "Moderators/Kumo%20-%20Moderator.jpg" },
    { name: "Samurai Kai", position: "Moderator", image: "Moderators/Samurai%20Kai%20-%20Moderator.jpg" },
    { name: "Sanjay", position: "Moderator", image: "Moderators/Sanjay%20-%20Moderator.jpg" },
    { name: "Sunny", position: "Moderator", image: "Moderators/Sunny%20-%20Moderator.jpg" },
    { name: "Xailong", position: "Moderator", image: "Moderators/Xailong%20-%20Moderator.jpg" }
];

// Store reviews and votes in memory (in a real app, this would be stored on a server)
let reviews = [];
let votes = {};

// Initialize votes for each member
function initializeVotes() {
    [...teamMembers, ...moderators].forEach(member => {
        votes[member.name] = 0;
    });
}

// Function to create member cards
function createMemberCard(member, type) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.name = member.name;
    card.dataset.type = type;
    
    card.innerHTML = `
        <img src="${member.image}" alt="${member.name}" class="member-image" onerror="this.onerror=null;this.src='https://placehold.co/300x250/E8D5C8/2A1E1A?text=${encodeURIComponent(member.name)}';" onclick="openMemberModal('${member.name}', '${type}')">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p>${member.position}</p>
        </div>
    `;
    
    return card;
}

// Function to populate team grid
function populateTeamGrid() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';
    
    teamMembers.forEach(member => {
        const card = createMemberCard(member, 'team');
        teamGrid.appendChild(card);
    });
}

// Function to populate moderators grid
function populateModeratorsGrid() {
    const moderatorsGrid = document.getElementById('moderatorsGrid');
    moderatorsGrid.innerHTML = '';
    
    moderators.forEach(moderator => {
        const card = createMemberCard(moderator, 'moderator');
        moderatorsGrid.appendChild(card);
    });
}

// Function to populate person's name dropdown based on review type
function populatePersonNameDropdown() {
    const revieweeType = document.getElementById('revieweeType').value;
    const revieweeNameSelect = document.getElementById('revieweeName');
    
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
    // Display reviews for this member
    displayMemberReviews(name, type);
    
    // Scroll to the reviews section
    document.getElementById('member-reviews-modal').scrollIntoView({ behavior: 'smooth' });
}

// Function to display reviews for a specific member
function displayMemberReviews(name, type) {
    const modal = document.getElementById('member-reviews-modal');
    const modalTitle = document.getElementById('modal-member-name');
    const reviewsContainer = document.getElementById('member-reviews-container');
    
    // Set the modal title
    modalTitle.textContent = `${name} - ${type === 'team' ? 'Team Member' : 'Moderator'}`;
    
    // Filter reviews for this member
    const memberReviews = reviews.filter(review => 
        review.revieweeName === name && review.revieweeType === type
    );
    
    if (memberReviews.length === 0) {
        reviewsContainer.innerHTML = `<p>No feedback yet for this ${type === 'team' ? 'team member' : 'moderator'}.</p>`;
    } else {
        let reviewsHTML = '';
        memberReviews.forEach(review => {
            reviewsHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <h4>${review.title}</h4>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    </div>
                    <div class="review-content">
                        <p>${review.text}</p>
                    </div>
                    <div class="review-footer">
                        <span class="reviewer">${review.reviewerName}</span>
                        <span class="review-date">${review.date}</span>
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
    document.getElementById('member-reviews-modal').style.display = 'none';
}

// Function to open review modal for submitting new review
function openReviewModal(name, type) {
    document.getElementById('revieweeName').value = name;
    document.getElementById('revieweeType').value = type;
    
    // Scroll to the review form
    document.getElementById('submit-review').scrollIntoView({ behavior: 'smooth' });
}

// Function to display all reviews
function displayReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No feedback yet. Be the first to share your experience!</p>';
        return;
    }
    
    let reviewsHTML = '<h3>Community Feedback</h3>';
    reviews.forEach(review => {
        reviewsHTML += `
            <div class="review-item">
                <div class="review-header">
                    <h4>${review.title}</h4>
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                </div>
                <div class="review-content">
                    <p>${review.text}</p>
                </div>
                <div class="review-footer">
                    <span class="reviewer">${review.reviewerName}</span>
                    <span class="review-date">${review.date}</span>
                    <span class="review-subject">${review.revieweeType === 'team' ? 'Team Member' : 'Moderator'}: ${review.revieweeName}</span>
                </div>
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHTML;
}

// Function to populate voting candidates
function populateVotingCandidates() {
    const voteCandidate = document.getElementById('voteCandidate');
    voteCandidate.innerHTML = '';
    
    // Populate with team members first
    const teamOptGroup = document.createElement('optgroup');
    teamOptGroup.label = 'Core Team Members';
    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        teamOptGroup.appendChild(option);
    });
    voteCandidate.appendChild(teamOptGroup);
    
    // Then populate with moderators
    const modOptGroup = document.createElement('optgroup');
    modOptGroup.label = 'Moderators';
    moderators.forEach(mod => {
        const option = document.createElement('option');
        option.value = mod.name;
        option.textContent = mod.name;
        modOptGroup.appendChild(option);
    });
    voteCandidate.appendChild(modOptGroup);
}

// Function to update voting statistics
function updateVotingStats() {
    const statsContainer = document.getElementById('votingStatsContainer');
    
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
            document.getElementById('topPerformerName').textContent = name;
            document.getElementById('topPerformerPosition').textContent = person.position;
            document.getElementById('topPerformerVotes').textContent = voteCount;
            document.getElementById('topPerformerImage').src = person.image;
        }
    }
}

// Function to cast a vote
function castVote() {
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
    
    // In a real app, you would check if this user has already voted this week
    // For now, we'll just increment the vote count
    
    votes[candidateName] = (votes[candidateName] || 0) + 1;
    
    // Update the UI
    updateVotingStats();
    
    // Show confirmation
    alert(`Thank you for voting for ${candidateName}! Your community voice matters.`);
    
    // Clear the voter name field
    document.getElementById('voterName').value = '';
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize votes
    initializeVotes();
    
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
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
    document.querySelector('.rating').addEventListener('mouseleave', function() {
        const currentRating = ratingInput.value;
        
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
    
    // Form submission
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function(e) {
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
            date: new Date().toLocaleDateString()
        };
        
        // Add to reviews array
        reviews.push(review);
        
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
        document.getElementById('revieweeName').innerHTML = '<option value="">Select a person after choosing review type</option>';
    });
    
    // Add event listener to review type dropdown
    document.getElementById('revieweeType').addEventListener('change', populatePersonNameDropdown);
    
    // Voting functionality
    document.getElementById('castVoteBtn').addEventListener('click', castVote);
    
    // Populate voting candidates
    populateVotingCandidates();
    
    // Initialize voting stats
    updateVotingStats();
    
    // Close modal when clicking on the close button
    document.getElementById('close-modal').addEventListener('click', closeMemberModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('member-reviews-modal');
        if (event.target === modal) {
            closeMemberModal();
        }
    });
    
    // Populate grids when page loads
    populateTeamGrid();
    populateModeratorsGrid();
});