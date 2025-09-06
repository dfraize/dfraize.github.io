# Portfolio Site

A simple HTML/CSS/JavaScript portfolio site with HMR (Hot Module Replacement) development server.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **View the site:**
   Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
Portfolio Site/
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   └── main.js        # JavaScript functionality
├── images/            # Image assets
└── README.md          # This file
```

## 🛠️ Development

- **HMR Enabled:** Changes reflect immediately in the browser
- **Live Server:** Automatic browser refresh on file changes
- **Port 3000:** Access at `http://localhost:3000`

## 📝 Scripts

- `npm run dev` - Start development server with HMR
- `npm start` - Start production server
- `npm run build` - No build process needed (static site)
 - `npm run deploy:safe` - Safely deploys to GitHub by cloning the remote, replacing contents, committing, and pushing

## 🚢 Deploy (Safe, preserves history)

You can deploy your site to GitHub with one command from Cursor.

1. One-time setup (choose one):
   - Create a `.deploy.env` file in the project root with:
     ```bash
     DEPLOY_REPO="https://github.com/USER/REPO.git"
     DEPLOY_BRANCH="main"
     ```
     Then run:
     ```bash
     npm run deploy:safe
     ```
   - Or pass arguments directly each time:
     ```bash
     npm run deploy:safe -- https://github.com/USER/REPO.git main
     ```

This method clones your remote repo, wipes everything except `.git`, copies the local site, commits, and pushes to the specified branch.

## 🎨 Features

- Clean, modern design
- Responsive layout
- Google Fonts integration
- Simple and fast loading
- Easy to customize

## 📱 Responsive Design

The site is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Customization

Edit the files in their respective directories:
- `index.html` - Main content
- `css/style.css` - Styling
- `js/main.js` - Functionality 