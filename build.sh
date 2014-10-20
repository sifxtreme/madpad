sudo apt-get update
sudo apt-get install nodejs
sudo vim /etc/hostname 
sudo vim /etc/hosts
sudo reboot 
sudo vim /etc/nginx/sites-enabled/madpad
sudo service nginx restart
ln -s /etc/nginx/sites-enabled/madpad madpad-nginx
