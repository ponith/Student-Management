# Student Management System

A web application to add student records and view them in a table. Records are stored in MongoDB Atlas.

**Live link:** https://student-management-23nx.onrender.com

**Course:** Master of Computer Applications (MCA)
**College:** Vels Institute of Science, Technology & Advanced Studies (VISTAS), Pallavaram, Chennai
**Developer:** Ponith Kumar (Roll No. 25304232)

## Features

- Add a student with name, roll number, email, age, and course
- View all student records in a table
- Live search by name, roll number, email, or course
- Roll numbers must be between 25304200 and 25304260
- Each roll number and each email can be used only once
- Maximum of 60 students
- Animated interface and a college details popup

## Technology Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js with Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Hosting:** Render
- **Tools:** Visual Studio Code, npm, Nodemon

## Project Structure

```
student-management/
├── models/
│   └── Student.js      # Student data model and validation rules
├── public/
│   ├── index.html      # Web page layout and styles
│   ├── script.js       # Form, table, and search logic
│   └── image.png       # College logo
├── server.js           # Express server and API routes
├── package.json        # Project dependencies and scripts
└── .gitignore          # Files excluded from GitHub
```

## Setup on a New Computer

### 1. Install the requirements

- Node.js version 20.19 or newer (download the LTS version from nodejs.org)
- Visual Studio Code (optional, for editing)

### 2. Download the project

Clone the repository or download it as a ZIP file from GitHub, then open the folder.

```bash
git clone https://github.com/ponith/Student-Management.git
cd Student-Management
```

### 3. Install the packages

```bash
npm install
```

### 4. Create the `.env` file

Create a file named `.env` in the project root with these lines:

```env
MONGO_URI=your_mongodb_connection_string_here
PORT=3042
```

Replace the connection string with your own MongoDB Atlas connection string. Never upload this file to GitHub.

### 5. Start the server

```bash
npm run dev
```

You should see:

```
Connected to MongoDB
Server running at http://localhost:3042
```

### 6. Open the app

Go to http://localhost:3042 in your browser.

## Rules

| Rule | Details |
|---|---|
| Roll number range | 25304200 to 25304260 (8 digits) |
| Unique roll number | Each roll number can be used once |
| Unique email | Each email can be used once (blank emails are allowed) |
| Student limit | Maximum of 60 records |

The server checks these rules, so they apply even if the form is filled in another way.

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/students` | Get all student records |
| POST | `/api/students` | Add a new student |

## Author

**Ponith Kumar**
Roll No: 25304232
MCA, VISTAS
