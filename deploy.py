import os
from dotenv import load_dotenv
from utils import upload_folder_to_sftp, zip_folder, ssh_execute_command
from os import system

load_dotenv()

REMOTE_IP = os.getenv("REMOTE_IP")
PASSWORD = os.getenv("PASSWORD")
REMOTE_USERNAME = os.getenv("REMOTE_USERNAME")

# system("npm run docs:build")
upload_folder_to_sftp(REMOTE_IP, REMOTE_USERNAME, PASSWORD, "./.vitepress/dist", "/var/www/html")
