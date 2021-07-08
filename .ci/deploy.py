#!/usr/bin/env python3
import os
from classes.client import DeploymentClient
from classes.config import Config

base_path = os.path.dirname(os.path.realpath(__file__)) + '/..'

config = Config(base_path, 'deploy.yml')
if config.check_env() is False:
  exit(1)

worker = DeploymentClient(config)
worker.prepare_release()
worker.prepare_cleanup()

for task in config.tasks:
  worker.queue(task)

worker.deploy()

logs = worker.build_logs()
print(logs)