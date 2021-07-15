# DK-team
Website for beauty salons, with big calendar and communcation with customers

# Requirements
* Yarn ^1.22.10
* Python ^3.8.0

# Configuration Development

* Frontend

  * In the folder `frontend` run `yarn install` to install all packages,  
  * To start the server run `yarn start`  
The server will be available at `localhost:3000`

* Backend
  
  * In the folder `backend` to create virtual enviroment run `python -m venv env`,  
  * To activate enviroment run `source env/Scripts/activate`.  
  * To install all the requirements run `pip install -r requirements.txt`  
  * To start the server run `python manage.py runserver`  
The server will be available at `localhost:8000`

# Configuration production
To configure project to the production build first you need to configure it to the development mode  
Then in the folder `frontend` run `yarn build`

The production build will be available at `localhost:8000`

