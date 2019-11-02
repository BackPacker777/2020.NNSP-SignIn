## Todo:

* Print meal tickets ??
* ~~Finish signoffs for night shift~~
* ~~Make half-day print out with a grey line~~
* Create Narnia for admin to update totals, do signoffs, and misc. shift stuff. - 70% complete
~~* Add ability to undo join shift action~~
* ~~Hide shift counts and move them to an alert box at signin~~
* ~~Fix Patroller work button from running multiple times....~~
* Add upload patroller roster csv capability - Done, just needs to be incorporated


## systemctl config

https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6
https://www.terlici.com/2015/06/20/running-node-forever.html

----------------------------------------------------------------------------

[Unit]
Description=2020 NNSP Signin Service App
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/usr/bin/env bash /var/www/2020.nnsp-signin/start.sh

[Install]
WantedBy=multi-user.target

-----------------------------------------------------------------------------