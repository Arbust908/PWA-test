import os
from scp import SCPClient

class Command:
  def __init__(self, command):
    self.cmd = command
    self.running = False
    self.done = False
    self.success = False
    self.output = None

  def run(self, client):
    self.running = True
    chan = client.get_transport().open_session()
    chan.set_combine_stderr(True)
    chan.exec_command(self.cmd)
    self.complete(chan)
  
  def complete(self, chan):
    while self.running:
      if chan.recv_ready():
        self.output = chan.recv(4096).decode('utf-8')
      if chan.exit_status_ready():
        self.success = chan.recv_exit_status() == 0
        self.running = False
    self.done = True
    chan.close()

  def build_log(self):
    return [
      'Running [%s] - exit %s' % (self.cmd, 'successfully' if self.success else 'with errors'),
      'Output:\n%s' % self.output,
      '------------------------'
    ]

class SCPCommand:
  def __init__(self, source, target, base_path):
    self.source = source
    self.target = target
    self.success = False
    self.done = False
    self.base_path = base_path
    self.from_mem = False

  def set_from_mem(self):
    self.from_mem = True

  def run(self, client):
    scp = SCPClient(client.get_transport())
    if self.from_mem:
      scp.putfo(self.source, remote_path=self.target)
      self.source.close()
    else:
      scp.put('%s/%s' % (self.base_path, self.source), remote_path=self.target)
    scp.close()
    self.success = True
    self.done = True
    
  def build_log(self):
    source = 'FROM MEMORY' if self.from_mem else self.source
    return [
      'Copying artifact [%s]' % source,
      'Target [%s]' % self.target,
      '------------------------'
    ]