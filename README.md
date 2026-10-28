# TaskFlow – Student Task Manager

TaskFlow is a small browser-based task manager made for students to organise assignments, lab records, exams and project deadlines.

## Features

- Add tasks with a subject, due date and priority
- Edit and delete tasks
- Mark tasks as completed
- Filter all, pending and completed tasks
- View total, pending and completed task counts
- Highlight overdue tasks
- Save tasks in the browser with LocalStorage
- Responsive layout for desktop and mobile

## Technologies

- HTML
- CSS
- JavaScript
- Browser LocalStorage

## Run locally

1. Download or clone this repository.
2. Open the `TaskFlow` folder in VS Code.
3. Open `index.html` in a browser.

You can also use the VS Code Live Server extension, then right-click `index.html` and choose **Open with Live Server**.

No Node.js, database, API key or build command is required.

## Deploy with GitHub Pages

1. Sign in to GitHub and create a new **public** repository named `taskflow-student-manager`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open the repository's **Settings**.
4. Select **Pages** from the left menu.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)` folder, then click **Save**.
7. Wait a few minutes. GitHub will show your published website URL in the Pages section.

The URL will usually look like:
`https://YOUR-USERNAME.github.io/taskflow-student-manager/`

Replace `YOUR-USERNAME` with your GitHub username.

## Important note

Tasks are stored in the browser that you use. They do not sync across different browsers or devices, and clearing browser data can remove them. This version does not include user accounts or cloud storage.

## Suggested improvements

- Search tasks by title
- Add reminders
- Export tasks to CSV
- Add login and database support in a future version
