# Cardflow

Cardflow is an intuitive Kanban-style task management web app that streamlines planning and organization. Key features include: 
- Task Boards: Create, read, update, and delete fully customizable boards to manage projects efficiently.
- Organized Lists: Categorize tasks into lists for better organization and progress tracking.
- Interactive Task Cards: Add, edit, and drag-and-drop task cards between lists for dynamic project updates.
- Collaborative Comments: Facilitate teamwork with card-specific comments for clear communication. 

Designed for ease of use, Cardflow empowers individuals and teams to manage their workflows with efficiency and simplicity.


## Preview

![image](/doc/boards.png)
![image](/doc/lists.png)
![image](/doc/card.png)



## Technologies Used

- Backend
  - Flask
  - SQLAlchemy

- Frontend
  - React
  - Redux
  - CSS
  - Dnd Kit


## How to Launch

1. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

2. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```
3. Run frontend server
    ```bash
   cd react-vite && npm run dev
   ```