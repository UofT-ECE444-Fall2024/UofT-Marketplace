# Boba? ECE444 Project
This version of the website is built using Flask and React, orchestrated with Docker.

**Sprint Board:** https://app.zenhub.com/workspaces/boba-670dba42c9644c000f9c6fe0/board

## Tools used
* Zenhub: https://www.zenhub.com/

## Built with
* ReactJS: https://react.dev/
* Flask: https://flask.palletsprojects.com/en/stable/
* SQLAlchemy: https://www.sqlalchemy.org/
* MaterialUI Library: https://mui.com/
* Tailwind: https://tailwindcss.com/
* Docker: https://www.docker.com/
* Amazon S3: https://aws.amazon.com/s3/

## Setup
* Install Python3.9
* Install Node.js
* Install Docker


## Development
1. Ensure your local files are synced with any updates on GitHub.
2. Run the following commands in the main directory (make sure Docker is running!). NOTE: The build command may take 3-4 minutes, but you only need it to run it once:
```
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```
and navigate to http://localhost:3000/ to view your local version of the website!


* The `build` command should be ran after any packages are installed, so to be safe, run it every time you pull from GitHub (and whenever you install new packages).
* Hot reloading is enabled for both Flask and React, meaning you can make changes to your files, save them, and they'll be reflected on localhost.
* If stuff seems broken and you're not sure why, try running `docker system prune -a` then the usual build and run commands. This sometimes happens because Docker caches packages from an outdated code, causing package discrepencies.
* Sometimes you need a `-V` at the end of the command, but idk.

## Pushing Working Changes
1. Make sure your changes are working
2. Make sure you are on an appropriate branch
    * To view existing branches: `git branch`
    * To switch to an existing branch: `git checkout <branch_name>`
    * To create a new branch and switch to it: `git checkout -b <branch_name>`
3. Add the appropriate files to commit: `git add <file_name>`
4. Create a new commit: `git commit -m "quality message"`
5. Push the commit to GitHub: `git push`

## Handling Python Unresolved Imports
You might be seeing plenty of `unresolved import` warnings for Python files. This is because we haven't actually installed any of the Python packages locally; they're currently all on the Docker image. To get around this, we'll create a virtual environment for this project where we can install packages.
```
cd api
python3.9 -m venv venv
```
Then, create a folder `.vscode` at the top of the project and a file `settings.json` with the following:
```
{
    "python.pythonPath": "${workspaceFolder}/api/venv",
}
```
Don't worry that this folder and file are being ignored from Git! This is intentional.

Every time there are new Python dependencies, you'll need to do the following to install them:
```
source venv/bin/activate
pip3 install -r requirements.txt
```
You may have to restart VS Code for the squiggly lines to go away.

## NOTES
Needed to manually install dev depencies for `react-calendar-month-view`; not sure why but should fix eventually.

Also, if you add a field to an Airtable record, make sure to add it's default to `api/defaults.py`. Otherwise, our API requests will just ignore that field.


[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15973525&assignment_repo_type=AssignmentRepo)
