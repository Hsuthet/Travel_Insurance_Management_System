🛠 Prerequisites
Before setting up, ensure you have the following installed:

PHP >= 8.2

Composer

Node.js & NPM

MySQL (XAMPP / WAMP)

📥 Local Setup Instructions
Follow these steps to get the project running on your local machine:

1. Clone the Repository
Bash
git clone https://github.com/YourUsername/travel-insurance-system.git
cd travel-insurance-system
2. Install Dependencies
Bash
# Install PHP packages
composer install

# Install Frontend packages
npm install
3. Environment Configuration
Copy the example environment file and generate a unique application key:

Bash
cp .env.example .env
php artisan key:generate
4. Database Setup
Create a database named travel in your local MySQL.

Update your .env file with your database credentials:

Code snippet
DB_DATABASE=travel
DB_USERNAME=root
DB_PASSWORD=your_password
Run migrations and seed the database with initial data (Plans, Admin user, etc.):

Bash
php artisan migrate --seed
5. Start the Application
You will need two terminal windows:

Terminal 1 (Backend):

Bash
php artisan serve
Terminal 2 (Frontend):

Bash
npm run dev
🗄️ Database Schema
The system consists of the following core tables:

users: Authentication and Roles (Admin).

customers: Personal details of the insured.

plans: Available insurance packages.

benefits: Available benefits

benefit-types: Available benefit-types.

contracts: Central table linking customers, plans, and travel info.

claims: Insurance claim management.

payments: Transaction history.

beneficiaries: person who get the insurance when the insured person is death.

declarations:Storing which plan has which declaration



📬 Contributing
Create a new branch for your task: git checkout -b feature/task-name

Commit your changes: git commit -m "Add feature description"

Push to the branch: git push origin feature/task-name

Create a Pull Request (PR) for the Lead to review.

Lead's Note:
"Please ensure you run the --seed flag during migration to get the initial Insurance Plans data. If you encounter any issues with the .env setup, contact me immediately."

How to save this:
Open your project folder.

Open the existing README.md file.

Delete everything inside it.

Paste the code above and save it.

Run:

Bash
git add README.md
git commit -m "docs: customize readme for team setup"
git push origin main