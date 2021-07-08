import os
import yaml
from yaml.loader import SafeLoader

class Config:
  def __init__(self, base_path, filepath: str):
    self.required_vars = []
    self.tasks = []
    self.artifacts = []
    self.env = {}
    self.target_dir = None
    self.base_path = base_path
    self.yaml = self.load_yaml('%s/%s' % (base_path, filepath))

  def load_yaml(self, filepath):
    with open(filepath) as f:
      data = yaml.load(f, Loader=SafeLoader)
      self.required_vars = self.get_from_def(data, 'required_vars', [])
      self.tasks = self.get_from_def(data, 'tasks', [])
      self.target_dir = self.get_from_def(data, 'target_dir')
      self.artifacts = self.get_from_def(data, 'artifacts', [])
      if self.target_dir == None:
        print("Error: target_dir is not defined in deploy.yml")
        exit(1)
      print(self.target_dir)
      return data

  def get_from_def(self, data, key, default=None):
    if not key in data:
      return default
    if data[key] is None:
      return default
    return data[key]

  def check_env(self):
    succeed = True
    for key in self.required_vars:
      value = os.getenv(key)
      if value == None:
        print("Value for %s is not present in the current environment" % key)
        succeed = False
    return succeed

  def get_env(self, key, default=''):
    if key in self.env:
      return self.env[key]
    env = os.getenv(key)
    if env:
      self.env[key] = env
      return env
    return default
