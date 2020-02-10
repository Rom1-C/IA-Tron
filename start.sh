#! /bin/bash

gnome-terminal -e "python ./launch.py"
sleep 2
gnome-terminal -e "node connect.js"
sleep 2
gnome-terminal -e "python ./main.py"
