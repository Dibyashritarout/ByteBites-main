# Adding Video to ByteBites Homepage

## Video Background Setup

I've added a video background feature to your homepage! Here's what you need to do:

### 📹 Adding Your Video File

1. **Get a food-related video** (recommended sources):
   - Download from free stock video sites like:
     - Pexels: https://www.pexels.com/search/videos/food/
     - Pixabay: https://pixabay.com/videos/search/restaurant/
     - Coverr: https://coverr.co/
   
2. **Save the video** in this folder:
   ```
   static/images/backgrounds/
   ```

3. **Rename your video to**:
   - `hero-video.mp4` (preferred format)
   - OR `hero-video.webm` (for better compression)

### 🎬 Video Recommendations

**Best video specifications:**
- Duration: 10-30 seconds (it will loop automatically)
- Resolution: 1920x1080 (Full HD) or higher
- File size: Keep under 10MB for fast loading
- Content: Food preparation, restaurant atmosphere, or dishes

**Suggested search terms for stock videos:**
- "food cooking"
- "restaurant kitchen"
- "chef preparing food"
- "delicious food"
- "dining experience"

### ✨ Features Included

1. **Auto-play**: Video plays automatically when page loads
2. **Loop**: Video repeats continuously
3. **Muted**: Video plays without sound
4. **Play/Pause Button**: Users can pause/play the video (bottom-right corner)
5. **Fallback**: If video doesn't load, shows the existing background image
6. **Responsive**: Works on both desktop and mobile devices
7. **Dark Overlay**: Ensures text remains readable over the video

### 🔧 Current Setup

- Video element is already in `templates/index.html`
- CSS styling is in `static/css/landing.css`
- JavaScript controls are in `static/js/video-controls.js`
- Everything is ready - just add your video file!

### 🎨 Customization Options

**Change overlay darkness** (in `landing.css`):
```css
.video-overlay {
  background: rgba(0, 0, 0, 0.5); /* Change 0.5 to 0.3 for lighter, 0.7 for darker */
}
```

**Hide play/pause button** (remove from `index.html`):
```html
<!-- Remove or comment out this section -->
<button class="video-control" id="videoControl">
```

### 📱 Testing

After adding your video:
1. Refresh your browser (Ctrl+R or F5)
2. The video should start playing automatically
3. Click the pause button (bottom-right) to test controls

### ⚠️ If Video Doesn't Work

Don't worry! The page will automatically fall back to the existing background image. The site will work perfectly either way.

---

**Need help?** Make sure:
- Video file is in the correct folder: `static/images/backgrounds/`
- File name is exactly: `hero-video.mp4` (case-sensitive)
- Video format is MP4 (H.264 codec recommended)
