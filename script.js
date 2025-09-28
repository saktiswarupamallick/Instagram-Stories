class InstagramStories {
    constructor() {
        this.allStories = [];
        this.storiesByUser = {};
        this.users = [];
        this.activeUser = 0;
        this.activeStory = 0;
        this.currentId = null;
        this.timer = null;
        this.progressTimer = null;
        this.paused = false;
        this.duration = 5000;
        this.startTime = null;
        this.timeLeft = null;
        this.pausedWidth = null;
        this.progressBar = null;
        this.progressStart = null;
        this.progressPaused = false;
        
        this.init();
    }

    async init() {
        await this.loadStories();
        this.renderStoriesList();
        this.bindEvents();
    }

    async loadStories() {
        try {
            const response = await fetch('stories.json');
            const data = await response.json();
            this.allStories = data.stories;
        } catch (error) {
            console.error('Error loading stories:', error);
            this.allStories = [
                { id: 1, image: 'https://picsum.photos/400/800?random=1', user: 'user1' },
                { id: 2, image: 'https://picsum.photos/400/800?random=2', user: 'user2' },
                { id: 3, image: 'https://picsum.photos/400/800?random=3', user: 'user3' }
            ];
        }
        
        this.groupStoriesByUser();
    }

    groupStoriesByUser() {
        this.storiesByUser = {};
        this.users = [];
        
        this.allStories.forEach(story => {
            if (!this.storiesByUser[story.user]) {
                this.storiesByUser[story.user] = [];
                this.users.push(story.user);
            }
            this.storiesByUser[story.user].push(story);
        });
    }

    renderStoriesList() {
        const storiesList = document.getElementById('storiesList');
        storiesList.innerHTML = '';

        this.users.forEach((username, userIndex) => {
            const firstStory = this.storiesByUser[username][0];
            const storyItem = document.createElement('div');
            storyItem.className = 'story-item';
            storyItem.dataset.storyId = firstStory.id;
            storyItem.dataset.userIndex = userIndex;
            storyItem.dataset.username = username;
            
            storyItem.innerHTML = `
                <img src="${firstStory.image}" alt="Story ${firstStory.id}" loading="lazy">
            `;
            
            storyItem.addEventListener('click', () => this.openUserStories(userIndex));
            storiesList.appendChild(storyItem);
        });
    }

    bindEvents() {
        document.getElementById('closeBtn').addEventListener('click', () => this.closeStory());
        
        
        document.getElementById('leftZone').addEventListener('click', () => this.previousStory());
        document.getElementById('rightZone').addEventListener('click', () => this.nextStory());
        
        this.bindTouchEvents();
        
        document.addEventListener('keydown', (e) => {
            if (!this.isStoryViewerOpen()) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousStory();
                    break;
                case 'ArrowRight':
                    this.nextStory();
                    break;
                case 'Escape':
                    this.closeStory();
                    break;
            }
        });
    }

    bindTouchEvents() {
        const storyContent = document.getElementById('storyContent');
        let touchStartTime = 0;
        let isTouchHolding = false;
        let touchProcessed = false;
        let wasActuallyPaused = false;

        
        storyContent.addEventListener('touchstart', (e) => {
            if (!this.isStoryViewerOpen()) return;
            
            touchStartTime = Date.now();
            isTouchHolding = true;
            touchProcessed = false;
            wasActuallyPaused = false;
            
            setTimeout(() => {
                if (isTouchHolding && this.isStoryViewerOpen()) {
                    this.pauseAutoAdvance();
                    wasActuallyPaused = true;
                }
            }, 300);
        });

        storyContent.addEventListener('touchend', (e) => {
            if (!this.isStoryViewerOpen() || touchProcessed) return;
            
            touchProcessed = true;
            const touchDuration = Date.now() - touchStartTime;
            isTouchHolding = false;
            
            if (wasActuallyPaused) {
                this.resumeAutoAdvance();
            }
        });

        let mouseStartTime = 0;
        let isMouseHolding = false;
        let mouseWasActuallyPaused = false;
        
        storyContent.addEventListener('mousedown', () => {
            if (this.isStoryViewerOpen()) {
                mouseStartTime = Date.now();
                isMouseHolding = true;
                mouseWasActuallyPaused = false;
                
                setTimeout(() => {
                    if (isMouseHolding && this.isStoryViewerOpen()) {
                        this.pauseAutoAdvance();
                        mouseWasActuallyPaused = true;
                    }
                }, 300);
            }
        });

        storyContent.addEventListener('mouseup', () => {
            if (this.isStoryViewerOpen() && isMouseHolding) {
                const mouseDuration = Date.now() - mouseStartTime;
                isMouseHolding = false;
                
                if (mouseWasActuallyPaused) {
                    this.resumeAutoAdvance();
                }
            }
        });

        storyContent.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    openUserStories(userIndex) {
        this.activeUser = userIndex;
        this.activeStory = 0;
        
        const storyViewer = document.getElementById('storyViewer');
        storyViewer.classList.add('active');
        
        this.loadStoryContent();
        this.startAutoAdvance();
        this.updateProgressBars();
        this.updateStoryCounter();
        this.updateStoryUser();
        
        document.body.style.overflow = 'hidden';
    }

    getCurrentUserStories() {
        const currentUser = this.users[this.activeUser];
        return this.storiesByUser[currentUser];
    }

    getCurrentStory() {
        const userStories = this.getCurrentUserStories();
        return userStories[this.activeStory];
    }

    closeStory() {
        const storyViewer = document.getElementById('storyViewer');
        storyViewer.classList.remove('active');
        
        this.stopAutoAdvance();
        this.clearProgressBars();
        
        document.body.style.overflow = '';
        
        this.activeUser = 0;
        this.activeStory = 0;
        this.currentId = null;
    }

    loadStoryContent() {
        const storyImage = document.getElementById('storyImage');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const currentStory = this.getCurrentStory();
        
        loadingSpinner.classList.remove('hidden');
        storyImage.classList.remove('loaded');
        
        // Load image
        const img = new Image();
        img.onload = () => {
            storyImage.src = currentStory.image;
            storyImage.alt = `Story ${currentStory.id}`;
            
            setTimeout(() => {
                loadingSpinner.classList.add('hidden');
                storyImage.classList.add('loaded');
            }, 100);
        };
        
        img.onerror = () => {
            console.error('Failed to load story image:', currentStory.image);
            loadingSpinner.classList.add('hidden');
        };
        
        img.src = currentStory.image;
    }

    nextStory() {
        const userStories = this.getCurrentUserStories();
        const currentUser = this.users[this.activeUser];
        
        if (this.activeStory < userStories.length - 1) {
            this.activeStory++;
            this.loadStoryContent();
            this.updateProgressBars();
            this.updateStoryCounter();
            this.updateStoryUser();
            this.restartAutoAdvance();
        } else {
            if (this.activeUser < this.users.length - 1) {
                this.activeUser++;
                this.activeStory = 0;
                const nextUser = this.users[this.activeUser];
                this.loadStoryContent();
                this.updateProgressBars();
                this.updateStoryCounter();
                this.updateStoryUser();
                this.restartAutoAdvance();
            } else {
                this.closeStory();
            }
        }
    }

    previousStory() {
        const currentUser = this.users[this.activeUser];
        
        if (this.activeStory > 0) {
            this.activeStory--;
            this.loadStoryContent();
            this.updateProgressBars();
            this.updateStoryCounter();
            this.updateStoryUser();
            this.restartAutoAdvance();
        } else {
            if (this.activeUser > 0) {
                this.activeUser--;
                const prevUserStories = this.getCurrentUserStories();
                this.activeStory = prevUserStories.length - 1;
                const prevUser = this.users[this.activeUser];
                this.loadStoryContent();
                this.updateProgressBars();
                this.updateStoryCounter();
                this.updateStoryUser();
                this.restartAutoAdvance();
            }
        }
    }

    updateProgressBars() {
        const progressContainer = document.querySelector('.story-progress-container');
        progressContainer.innerHTML = '';
        
        const userStories = this.getCurrentUserStories();
        
        userStories.forEach((_, index) => {
            const progressBar = document.createElement('div');
            progressBar.className = 'story-progress';
            
            if (index < this.activeStory) {
                progressBar.classList.add('active');
            } else if (index === this.activeStory) {
                progressBar.classList.add('active');
                
                const animatedBar = document.createElement('div');
                animatedBar.className = 'story-progress-bar';
                progressBar.appendChild(animatedBar);
                
                setTimeout(() => {
                    this.animateProgress(animatedBar);
                }, 50);
            }
            
            progressContainer.appendChild(progressBar);
        });
    }

    animateProgress(progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';
        progressBar.style.animation = 'none';
        
        progressBar.offsetHeight;
        
        this.progressBar = progressBar;
        this.progressStart = Date.now();
        this.progressPaused = false;
        
        progressBar.style.animation = `progressFill ${this.duration}ms linear forwards`;
    }

    clearProgressBars() {
        const progressContainer = document.querySelector('.story-progress-container');
        progressContainer.innerHTML = '';
    }

    updateStoryCounter() {
        const userStories = this.getCurrentUserStories();
        document.getElementById('currentStory').textContent = this.activeStory + 1;
        document.getElementById('totalStories').textContent = userStories.length;
    }

    updateStoryUser() {
        const currentUser = this.users[this.activeUser];
        const userElement = document.querySelector('.story-user');
        if (userElement) {
            userElement.textContent = `@${currentUser}`;
        }
    }


    startAutoAdvance() {
        this.stopAutoAdvance();
        this.startTime = Date.now();
        
        this.timer = setTimeout(() => {
            this.nextStory();
        }, this.duration);
    }

    stopAutoAdvance() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    pauseAutoAdvance() {
        if (this.paused) return;
        
        this.paused = true;
        this.stopAutoAdvance();
        
        const elapsed = this.getElapsedTime();
        this.timeLeft = Math.max(0, this.duration - elapsed);
        
        const progressBars = document.querySelectorAll('.story-progress-bar');
        progressBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }

    resumeAutoAdvance() {
        if (!this.paused) return;
        
        this.paused = false;
        
        const timeToUse = this.timeLeft && this.timeLeft > 0 ? this.timeLeft : this.duration;
        
        const progressBars = document.querySelectorAll('.story-progress-bar');
        progressBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
        
        this.startTime = Date.now() - (this.duration - timeToUse);
        
        this.timer = setTimeout(() => {
            this.nextStory();
        }, timeToUse);
    }

    restartAutoAdvance() {
        this.stopAutoAdvance();
        this.startAutoAdvance();
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    isStoryViewerOpen() {
        return document.getElementById('storyViewer').classList.contains('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InstagramStories();
});
document.addEventListener('visibilitychange', () => {
    const app = window.instagramStories;
    if (app && app.isStoryViewerOpen()) {
        if (document.hidden) {
            app.pauseAutoAdvance();
        } else {
            app.resumeAutoAdvance();
        }
    }
});
