# Chiranjivi Neupane - Portfolio Website

A modern, dynamic portfolio website showcasing professional experience, skills, and education.

## 🌟 Features

- **Animated Gradient Background** - Beautiful purple/pink gradient that animates smoothly
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Interactive Skill Cards** - Hover effects and click animations
- **Smooth Animations** - Scroll-triggered animations and typing effects
- **Professional Timeline** - Visual representation of work experience and education
- **Contact Integration** - Direct email and LinkedIn links

## 🛠️ Technologies Used

- HTML5
- CSS3 (with custom animations)
- JavaScript (Vanilla)
- Tailwind CSS (via CDN)

## 📁 File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Custom CSS with animations and gradients
├── script.js           # JavaScript for interactivity
└── README.md          # This file
```

## 🚀 Deployment to GitHub Pages

### Method 1: Using GitHub Repository Settings

1. **Create a GitHub repository** (if you haven't already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** section
   - Under **Source**, select `main` branch
   - Click **Save**
   - Your site will be published at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

3. **Wait for deployment** (usually takes 1-2 minutes)
   - Check the Actions tab to see deployment status
   - Once complete, visit your site URL

### Method 2: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository → Select your folder
3. Publish repository to GitHub
4. Follow steps 2-3 from Method 1

## 🔧 Troubleshooting

### Issue: Gradient backgrounds appear white

**Solution:** The `styles.css` file contains `!important` declarations to ensure gradients load properly. Make sure:
- `styles.css` is loaded AFTER Tailwind CSS CDN
- All three files (index.html, styles.css, script.js) are in the same directory
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)

### Issue: Animations not working

**Solution:**
- Ensure JavaScript is enabled in your browser
- Check browser console for errors (F12)
- Verify `script.js` is loading correctly

### Issue: Skills cards not displaying

**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Ensure the `renderSkills()` function is being called

## 🎨 Customization

### Changing Colors

Edit `styles.css` to modify the gradient background:

```css
.gradient-bg {
    background: linear-gradient(-45deg, #YOUR_COLOR1, #YOUR_COLOR2, #YOUR_COLOR3, #YOUR_COLOR4) !important;
}
```

### Modifying Skills

Edit the `skills` array in `script.js`:

```javascript
const skills = [
    { name: 'Your Skill', color: 'from-COLOR1 to-COLOR2', icon: '🎯' },
    // Add more skills...
];
```

### Updating Experience

Modify the Experience section in `index.html` to add/remove positions.

## 📧 Contact

- **Email:** chiranjivi.neupane96@gmail.com
- **LinkedIn:** [linkedin.com/in/chiranjivi-neupane-315104123](https://www.linkedin.com/in/chiranjivi-neupane-315104123)
- **Location:** Sydney, NSW, Australia

## 📄 License

This project is open source and available for personal use.

## 🙏 Acknowledgments

- Tailwind CSS for utility classes
- Font Awesome concepts for icons
- Modern web design principles

---

Made with ❤️ by Chiranjivi Neupane

