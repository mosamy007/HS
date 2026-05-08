# Portfolio Overlay Names Removed

## Changes Made:

### 1. **HTML (index.html)**
Removed all `portfolio-overlay` divs with image titles from the 6 initial portfolio items:

**Before:**
```html
<div class="portfolio-item">
    <img src="..." alt="Project 1">
    <div class="portfolio-overlay">
        <h3 data-en="Industrial Project" data-ar="مشروع صناعي">Industrial Project</h3>
    </div>
</div>
```

**After:**
```html
<div class="portfolio-item">
    <img src="..." alt="Project 1">
</div>
```

### 2. **JavaScript (script.js)**
Removed overlay creation code from the "Load More" functionality:

**Before:**
```javascript
const overlay = document.createElement('div');
overlay.className = 'portfolio-overlay';

const title = document.createElement('h3');
title.setAttribute('data-en', 'Construction Project');
title.setAttribute('data-ar', 'مشروع إنشائي');
title.textContent = currentLang === 'en' ? 'Construction Project' : 'مشروع إنشائي';

overlay.appendChild(title);
portfolioItem.appendChild(img);
portfolioItem.appendChild(overlay);
```

**After:**
```javascript
portfolioItem.appendChild(img);
```

## Result:
✅ Portfolio images now display clean without any text overlay
✅ Hover effects still work (scale on hover)
✅ Click to open lightbox still works
✅ Both initial 6 images and "Load More" images are consistent
✅ No naming or labeling on any portfolio images

## Note:
The CSS for `.portfolio-overlay` can be removed if desired, but leaving it doesn't cause any issues since it's not being used.
