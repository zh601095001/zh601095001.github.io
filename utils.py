import shutil

import paramiko
import os
from zipfile import ZipFile
from pathlib import Path


def sftp_put(sftp, local: Path, remote: Path):
    sftp.put(local.as_posix(), remote.as_posix())


def sftp_state(sftp, remote: Path):
    sftp.stat(remote.as_posix())


def sftp_mkdir(sftp, remote: Path):
    sftp.mkdir(remote.as_posix())


def upload_folder_to_sftp(host, username, password, local_dir_path, remote_dir_path, port=22):
    local_dir_path = Path(local_dir_path)
    remote_dir_path = Path(remote_dir_path)
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, port=port, username=username, password=password)
        sftp = client.open_sftp()

        # 为了递归上传文件夹，定义一个内部函数
        def _upload_dir(local_path, remote_path):
            # 确保远程路径存在
            try:
                sftp_state(sftp, remote_path)
            except FileNotFoundError:
                print(f"Creating remote directory {remote_path}")
                sftp_mkdir(sftp, remote_path)
            if not os.path.isdir(local_path):
                remote_item_path = remote_path / Path(local_path).name
                sftp_put(sftp, local_path, remote_item_path)
                return
            for item in os.listdir(local_path):
                local_item_path = local_path / item
                remote_item_path = remote_path / item

                if os.path.isdir(local_item_path):
                    # 如果是目录，则递归
                    _upload_dir(local_item_path, remote_item_path)
                else:
                    # 如果是文件，则上传
                    print(f"Uploading {local_item_path} to {remote_item_path}")
                    sftp_put(sftp, local_item_path, remote_item_path)

        # 开始上传文件夹
        _upload_dir(local_dir_path, remote_dir_path)

        print(f"Folder {local_dir_path} uploaded to {remote_dir_path}")
        sftp.close()
        client.close()

    except Exception as e:
        print(f"Failed to upload the folder: {e}")


def zip_folder(folder_path, output_file):
    # 确保输出文件的路径是没有扩展名的
    output_file_without_ext = os.path.splitext(output_file)[0]
    # 使用shutil.make_archive来创建zip文件
    shutil.make_archive(output_file_without_ext, 'zip', folder_path)
    print(f'Folder "{folder_path}" is zipped into "{output_file}"')


def ssh_execute_command(host, username, password, command, port=22):
    try:
        # 创建SSH客户端实例
        client = paramiko.SSHClient()
        # 自动接受未知的SSH密钥（不推荐用于生产环境）
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # 连接到远程服务器
        client.connect(hostname=host, port=port, username=username, password=password)

        # 执行命令
        stdin, stdout, stderr = client.exec_command(command)
        # 读取命令输出
        output = stdout.read().decode()
        error = stderr.read().decode()

        if error:
            print(f"Error: {error}")
        else:
            print(f"Output: {output}")

        # 关闭连接
        client.close()

    except Exception as e:
        print(f"Failed to execute command: {e}")
