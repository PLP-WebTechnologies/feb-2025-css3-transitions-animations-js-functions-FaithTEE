        // Create animated bubbles
        function createBubbles() {
            const container = document.querySelector('.container');
            const bubbleCount = 8;
            
            for (let i = 0; i < bubbleCount; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                // Random size between 20 and 60px
                const size = Math.random() * 40 + 20;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // Random position
                bubble.style.left = `${Math.random() * 100}%`;
                bubble.style.bottom = `${Math.random() * 100}%`;
                
                // Random animation delay
                bubble.style.animationDelay = `${Math.random() * 4}s`;
                
                container.appendChild(bubble);
            }
        }
        
        // Form input animations
        function setupFormAnimations() {
            const inputGroups = document.querySelectorAll('.input-group');
            
            inputGroups.forEach(group => {
                const input = group.querySelector('input, select');
                
                // Handle focus events
                input.addEventListener('focus', () => {
                    group.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (input.value.trim() === '') {
                        group.classList.remove('active');
                    }
                });
                
                // Check if input has value on page load
                if (input.value.trim() !== '') {
                    group.classList.add('active');
                }
            });
        }
        
        // Validate form
        function validateForm() {
            let isValid = true;
            
            // Validate name
            const nameInput = document.getElementById('fullname');
            const nameGroup = nameInput.closest('.input-group');
            
            if (nameInput.value.trim() === '') {
                nameGroup.classList.add('error');
                isValid = false;
            } else {
                nameGroup.classList.remove('error');
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailGroup = emailInput.closest('.input-group');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailPattern.test(emailInput.value)) {
                emailGroup.classList.add('error');
                isValid = false;
            } else {
                emailGroup.classList.remove('error');
            }
            
            // Validate password
            const passwordInput = document.getElementById('password');
            const passwordGroup = passwordInput.closest('.input-group');
            
            if (passwordInput.value.length < 6) {
                passwordGroup.classList.add('error');
                isValid = false;
            } else {
                passwordGroup.classList.remove('error');
            }
            
            // Validate age
            const ageInput = document.getElementById('age');
            const ageGroup = ageInput.closest('.input-group');
            const age = parseInt(ageInput.value);
            
            if (isNaN(age) || age < 18 || age > 120) {
                ageGroup.classList.add('error');
                isValid = false;
            } else {
                ageGroup.classList.remove('error');
            }
            
            // Validate interest
            const interestInput = document.getElementById('interest');
            const interestGroup = interestInput.closest('.input-group');
            
            if (interestInput.value === '') {
                interestGroup.classList.add('error');
                isValid = false;
            } else {
                interestGroup.classList.remove('error');
            }
            
            return isValid;
        }
        
        // Handle registration form submission
        function handleRegistration(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                // Add shake animation to form
                const container = document.querySelector('.container');
                container.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    container.style.animation = '';
                }, 500);
                return;
            }
            
            // Get form data
            const userData = {
                id: Date.now(), // Unique ID based on timestamp
                name: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value, // In a real app, never store plain text passwords
                age: document.getElementById('age').value,
                interest: document.getElementById('interest').value,
                date: new Date().toISOString()
            };
            
            // Store in local storage
            saveUserData(userData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            document.getElementById('registration-form').reset();
            
            // Reset active states
            document.querySelectorAll('.input-group').forEach(group => {
                group.classList.remove('active');
            });
            
            // Update members list
            displayMembers();
        }
        
        // Save user data to local storage
        function saveUserData(userData) {
            // Get existing data
            let users = JSON.parse(localStorage.getItem('marineRegisteredUsers')) || [];
            
            // Add new user
            users.push(userData);
            
            // Save back to local storage
            localStorage.setItem('marineRegisteredUsers', JSON.stringify(users));
        }
        
        // Show success message with animation
        function showSuccessMessage() {
            const successMessage = document.getElementById('success-message');
            successMessage.classList.add('active');
            
            setTimeout(() => {
                successMessage.classList.remove('active');
            }, 3000);
        }
        
        // Display registered members
        function displayMembers() {
            const membersContainer = document.getElementById('members-container');
            const membersList = document.getElementById('members-list');
            
            // Get user data
            const users = JSON.parse(localStorage.getItem('marineRegisteredUsers')) || [];
            
            // Clear current list
            membersList.innerHTML = '';
            
            // Show members container if we have members
            if (users.length > 0) {
                membersContainer.style.display = 'block';
                
                // Add each member to the list
                users.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div>
                            <strong>${user.name}</strong> - ${user.email}
                            <div>${user.interest}</div>
                        </div>
                        <button class="delete-btn" data-id="${user.id}">Remove</button>
                    `;
                    membersList.appendChild(listItem);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        deleteUser(parseInt(userId));
                    });
                });
            } else {
                membersContainer.style.display = 'none';
            }
        }
        
        // Delete a user
        function deleteUser(userId) {
            // Get existing data
            let users = JSON.parse(localStorage.getItem('marineRegisteredUsers')) || [];
            
            // Filter out the user to delete
            users = users.filter(user => user.id !== userId);
            
            // Save back to local storage
            localStorage.setItem('marineRegisteredUsers', JSON.stringify(users));
            
            // Update the display
            displayMembers();
        }
        
        // Initialize everything when the DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            createBubbles();
            setupFormAnimations();
            
            // Add form submission handler
            document.getElementById('registration-form').addEventListener('submit', handleRegistration);
            
            // Initialize members list
            displayMembers();
        });