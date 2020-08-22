# classroom lab

npm install
nodemon app

local student site
http://localhost:5000/home

local teacher site

http://localhost:5000/users/login
http://localhost:5000/lessons

Public site

mrdrakesclassroom.com 

Geology student : studentgeo/rocks123 
Marine Biology student : studentmb/fish123

You can run MongoDB as a macOS service using brew, or you can run MongoDB manually as a background process. It is recommended to run MongoDB as a macOS service, as doing so sets the correct system ulimit values automatically (see ulimit settings for more information).

To run MongoDB (i.e. the mongod process) as a macOS service, issue the following:

brew services start mongodb-community@4.4
To stop a mongod running as a macOS service, use the following command as needed:

brew services stop mongodb-community@4.4
To run MongoDB (i.e. the mongod process) manually as a background process, issue the following:

mongod --config /usr/local/etc/mongod.conf --fork
To stop a mongod running as a background process, connect to the mongod from the mongo shell, and issue the shutdown command as needed.

Both methods use the /usr/local/etc/mongod.conf file created during the install. You can add your own MongoDB configuration options to this file as well.