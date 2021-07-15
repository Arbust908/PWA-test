#!/usr/bin/env python3
import io
import os
from datetime import datetime
import paramiko
from .command import Command, SCPCommand

class DeploymentClient:
  def __init__(self, config):
    self.config = config
    self.client = self.build_client()
    self.stages = {
      'prepare': [],
      'deploy': [],
      'cleanup': []
    }
    self.release_vars = self.build_release_vars()

  # Builds the SSH client to connect to the remote host.
  def build_client(self):
    aws_host = self.config.get_env('AWS_HOST')
    aws_user = self.config.get_env('AWS_USER')
    key = self.build_key()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.load_system_host_keys()
    client.connect(hostname=aws_host, username=aws_user, pkey=key)
    return client

  # Builds the SSH key that the client will use
  def build_key(self):
    default_aws_key_path = self.config.get_env('HOME') + '/.ssh/config'
    aws_key_path = self.config.get_env('AWS_KEY_PATH', default_aws_key_path)
    aws_key_type = self.config.get_env('AWS_KEY_TYPE', 'config_file')

    if aws_key_type == 'config_file':
      return self.key_from_config(aws_key_path)
    if aws_key_type == 'rsa':
      return self.key_from_rsa(aws_key_path)
    print('Invalid AWS_KEY_TYPE value')
    exit(1)

  # Builds the SSH key based on a config file
  def key_from_config(self, path):
    config = paramiko.SSHConfig()
    with open(path) as file:
      config.parse(file)
    aws_host = self.config.get_env('AWS_HOST')
    host_conf = config.lookup(aws_host)
    return paramiko.RSAKey.from_private_key_file(host_conf["identityfile"][0])

  # Builds the SSH key based on a rsa type file
  def key_from_rsa(self, path):
    return paramiko.RSAKey.from_private_key_file(path)

  def build_release_vars(self):
    date = datetime.today().strftime('%Y_%m_%d_%H%M%S')
    return {
      'release_name': 'rel_%s' % date
    }

  # Builds logs to be printed
  def build_logs(self):
    logs = ''
    for stage in self.stages:
      for command in self.stages[stage]:
        if command.done == True:
          logs = logs + '\n'.join(command.build_log()) + "\n"
    return logs

  # Adds a command to the deployment stage queue
  def queue(self, command):
    cd = 'cd {cfg.target_dir}/{rel.release_name} && '
    built_command = self.replace_vars(cd + command)
    self.stages['deploy'].append(Command(built_command))

  # Runs all the stages and their commands
  def deploy(self):
    for stage in self.stages:
      for command in self.stages[stage]:
        command.run(self.client)
        if not command.success:
          return

  # Queues the preparation stage commands
  def prepare_release(self):
    commands = []
    commands.append('mkdir -p {cfg.target_dir}'),
    commands.append('mkdir -p {cfg.artifacts_dir}'),
    for artifact in self.config.artifacts:
      self.build_artifacts_cmd(commands, artifact)
    commands.append('mkdir -p {cfg.target_dir}/{rel.release_name}')

    buffer = io.BytesIO()
    for key in os.environ:
      if key[:4] == 'SVC_':
        string = '%s=%s\n' % (key[4:], os.environ[key])
        buffer.write(string.encode('utf-8'))
    buffer.seek(0)
    envcmd = SCPCommand(buffer, self.replace_vars('{cfg.target_dir}/environment'), self.config.base_path)
    envcmd.set_from_mem()
    commands.append(envcmd)

    for command in commands:
      if isinstance(command, SCPCommand):
        pass
      else:
        built_cmd = self.replace_vars(command)
        command = Command(built_cmd)
      self.stages['prepare'].append(command)

  def build_artifacts_cmd(self, commands, artifact):
    commands.append(
      SCPCommand(
        artifact, 
        '%s/%s' % (self.config.target_dir, 'artifacts'), 
        self.config.base_path
      )
    )

  # Queues the cleanup stage commands
  def prepare_cleanup(self):
    pass

  def replace_vars(self, strvar):
    strvar = strvar.replace('{cfg.target_dir}', self.config.target_dir)
    strvar = strvar.replace('{cfg.artifacts_dir}', self.config.target_dir + '/artifacts')
    for var in self.release_vars:
      strvar = strvar.replace('{rel.' + var + '}', self.release_vars[var])
    for key in os.environ:
      strvar = strvar.replace('{env.' + key + '}', self.config.get_env(key))
    return strvar