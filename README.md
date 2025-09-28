# Instagram Stories Clone

A fully-featured Instagram Stories clone built with vanilla JavaScript, HTML, and CSS. This project replicates the core Instagram Stories experience with smooth animations, touch interactions, and responsive design.

## 🚀 Features

### Core Functionality
- **Story Viewing**: Full-screen story viewer with Instagram-like interface
- **Multi-User Support**: Stories grouped by users with seamless navigation between users
- **Auto-Advance**: Stories automatically advance after 5 seconds
- **Progress Indicators**: Visual progress bars showing current story position
- **Smooth Transitions**: Fade-in animations and loading states

### Navigation & Controls
- **Touch/Mouse Navigation**: 
  - Tap left side to go to previous story
  - Tap right side to go to next story
  - Hold to pause story playback
- **Keyboard Support**: Arrow keys for navigation, Escape to close
- **Story Counter**: Shows current story position (e.g., "2 / 5")
- **User Display**: Shows current user's username with gradient border

### Mobile Optimizations
- **Touch Events**: Optimized touch handling for mobile devices
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Landscape Mode**: Adjusted layout for landscape orientation
- **Context Menu Prevention**: Disabled context menu on long press
- **Zoom Prevention**: Disabled user scaling for app-like experience

### Advanced Features
- **Pause/Resume**: Hold to pause, release to resume with remaining time
- **Tab Visibility**: Automatically pauses when browser tab is not active
- **Loading States**: Spinner animation while images load
- **Error Handling**: Fallback images if story loading fails
- **Memory Management**: Proper cleanup of timers and event listeners

## 📁 Project Structure

```
Instagram-Stories/
├── index.html          # Main HTML structure
├── script.js           # Core JavaScript functionality
├── style.css           # Styling and animations
├── stories.json        # Story data configuration
└── README.md           # This file
```

## 🛠️ Technical Implementation

### Main Class: `InstagramStories`

#### Core Properties
- `allStories[]` - Array of all story objects
- `storiesByUser{}` - Stories organized by username
- `users[]` - List of usernames in order
- `activeUser` - Currently viewing user index
- `activeStory` - Currently viewing story index
- `timer` - Auto-advance timer reference
- `duration` - Story display duration (5000ms)
- `paused` - Pause state boolean

#### Key Methods

**Initialization & Data Loading**
- `init()` - Initializes the application
- `loadStories()` - Fetches stories from JSON file with error handling
- `groupStoriesByUser()` - Organizes stories by username
- `renderStoriesList()` - Renders story thumbnails in header

**Story Navigation**
- `openUserStories(userIndex)` - Opens story viewer for specific user
- `nextStory()` - Advances to next story or next user
- `previousStory()` - Goes to previous story or previous user
- `closeStory()` - Closes story viewer and cleans up

**Content Management**
- `loadStoryContent()` - Loads and displays current story image
- `getCurrentUserStories()` - Returns stories for active user
- `getCurrentStory()` - Returns current story object

**Progress & Timing**
- `updateProgressBars()` - Updates visual progress indicators
- `animateProgress(progressBar)` - Animates progress bar fill
- `startAutoAdvance()` - Starts auto-advance timer
- `stopAutoAdvance()` - Stops auto-advance timer
- `pauseAutoAdvance()` - Pauses story with time tracking
- `resumeAutoAdvance()` - Resumes with remaining time

**Event Handling**
- `bindEvents()` - Sets up keyboard and click events
- `bindTouchEvents()` - Advanced touch/mouse interaction handling
- `updateStoryCounter()` - Updates story position display
- `updateStoryUser()` - Updates username display

**Utility Methods**
- `getElapsedTime()` - Calculates elapsed story time
- `isStoryViewerOpen()` - Checks if story viewer is active
- `restartAutoAdvance()` - Restarts auto-advance from beginning

### Event System

**Touch/Mouse Events**
- Touch start/end with hold detection (300ms threshold)
- Mouse down/up with pause functionality
- Navigation zones (left/right tap areas)
- Context menu prevention

**Keyboard Events**
- `ArrowLeft` - Previous story
- `ArrowRight` - Next story  
- `Escape` - Close story viewer

**Browser Events**
- `visibilitychange` - Pause when tab becomes inactive
- `DOMContentLoaded` - Initialize application

## 🎨 Styling Features

### Design System
- **Instagram-inspired**: Gradient borders, black background
- **Typography**: System fonts for native feel
- **Colors**: Instagram gradient (#f09433 to #bc1888)
- **Animations**: CSS keyframes for smooth transitions

### Responsive Breakpoints
- **Mobile**: Optimized touch targets and spacing
- **Landscape**: Adjusted layout for horizontal orientation
- **Desktop**: Hover effects and larger click areas

### Key CSS Classes
- `.story-item` - Story thumbnail with gradient border
- `.story-viewer` - Full-screen story display
- `.story-progress` - Progress bar container
- `.story-progress-bar` - Animated progress indicator
- `.loading-spinner` - Loading animation
- `.nav-zone` - Invisible navigation areas

## 📱 Usage

1. **View Stories**: Click on any story thumbnail to start viewing
2. **Navigate**: 
   - Tap left/right sides of screen to navigate
   - Use arrow keys on desktop
   - Stories auto-advance every 5 seconds
3. **Pause**: Hold down on story to pause playback
4. **Close**: Click X button or press Escape key

## 🔧 Configuration

### Story Data Format (`stories.json`)
```json
{
  "stories": [
    {
      "id": 1,
      "image": "https://example.com/image.jpg",
      "user": "username"
    }
  ]
}
```

### Customization Options
- **Duration**: Modify `this.duration` in constructor (default: 5000ms)
- **Hold Threshold**: Adjust timeout in `bindTouchEvents()` (default: 300ms)
- **Animations**: Modify CSS keyframes and transitions
- **Colors**: Update gradient values in CSS

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: CSS Grid, Flexbox, ES6 Classes, Async/Await

## 🚦 Performance Features

- **Lazy Loading**: Images loaded on demand
- **Memory Management**: Proper timer cleanup
- **Efficient Rendering**: Minimal DOM manipulation
- **Touch Optimization**: Prevents accidental interactions
- **Animation Performance**: CSS transforms for smooth animations

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

*Built with ❤️ using vanilla JavaScript - no frameworks!*