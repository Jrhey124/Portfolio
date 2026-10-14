# John Rhey Pena — Portfolio

A responsive, buildless portfolio for showcasing education, experience, projects, skills, recognition, and contact details. The page uses plain HTML, CSS, and JavaScript, so it can run locally or on GitHub Pages without installing dependencies.

## Preview locally

Open `index.html` in a browser. If your browser restricts local scripts, run a small local server from this directory:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Update your information

Edit [`portfolio-data.js`](portfolio-data.js). It contains the content displayed throughout the site. Leave an optional field blank, or leave an optional list empty, and the related detail or section will be omitted automatically.

For example, update a project entry:

```js
{
  name: "CookEat",
  category: "PROJECT / BACKEND",
  description: "A short accurate description of the project.",
  icon: "assets/icon-server.svg",
  role: "Your role",
  contributions: ["A specific thing you built"],
  stack: ["A technology you actually used"],
  architecture: "How the system is structured",
  outcome: "A measured result, if you have one",
  image: "assets/cookeat.jpg",
  repository: "https://github.com/your-name/repository",
  demo: "https://example.com"
}
```

Add assets such as a résumé PDF, portrait, or project screenshot to an `assets/` folder, then set the matching path in `portfolio-data.js`. Set `profile.resume` to a résumé path to show a download button. Set `profile.photo` to a local portrait path and `profile.photoFallback` to the initials or short text to display if the image cannot load. Set `profile.focus` to change the short caption under your photo. The pixel workstation is `assets/workstation.svg`; project icon assets are also in `assets/`, and new projects without an `icon` use the folder icon. Education, certifications, labs, infrastructure, location, availability, and graduation date have example object shapes or fields beside their arrays in the data file. Only add details you can confirm.

The existing project descriptions are starting points based on the information supplied. Fill in your actual role, contributions, stack, results, and project links as appropriate. The site does not claim unconfirmed technologies or outcomes.

## Publish with GitHub Pages

The repository is already structured as a static site. In GitHub, open the repository’s **Settings → Pages**, select **Deploy from a branch**, choose the branch you want to publish and its root folder, then save. GitHub Pages will provide the public site URL after its deployment finishes. Keep `index.html`, `styles.css`, `script.js`, and `portfolio-data.js` together in the published folder.

## Accessibility and printing

The site supports keyboard navigation, mobile navigation, visible focus states, reduced motion preferences, and print styles. Use the browser’s print dialog to print or save a PDF.
