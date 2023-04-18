#!/bin/sh
export PM2_HOME="/home/ubuntu/.pm2"
pm2 update
echo "RESTARTING ALL"
pm2 restart all
echo "ALL RESTARTED"