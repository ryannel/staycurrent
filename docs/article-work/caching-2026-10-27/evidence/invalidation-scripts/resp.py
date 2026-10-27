# Minimal RESP2 client for evidence runs. Refuses to talk to any port but 7105.
import socket
class Redis:
    def __init__(self, port=7105):
        assert port == 7105
        self.s = socket.create_connection(('127.0.0.1', port))
        self.s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        self.f = self.s.makefile('rb')
        info = self.call('INFO', 'server').decode()
        assert 'tcp_port:7105' in info, 'wrong server'
    def send(self, *args):
        out = [b'*%d\r\n' % len(args)]
        for a in args:
            if not isinstance(a, bytes): a = str(a).encode()
            out.append(b'$%d\r\n%s\r\n' % (len(a), a))
        self.s.sendall(b''.join(out))
    def read(self):
        line = self.f.readline()
        t, rest = line[:1], line[1:-2]
        if t == b'+': return rest
        if t == b'-': raise Exception(rest.decode())
        if t == b':': return int(rest)
        if t == b'$':
            n = int(rest)
            if n < 0: return None
            data = self.f.read(n + 2)[:-2]
            return data
        if t == b'*':
            n = int(rest)
            if n < 0: return None
            return [self.read() for _ in range(n)]
        raise Exception('bad reply %r' % line)
    def call(self, *args):
        self.send(*args); return self.read()
    def pipeline(self, cmds):
        buf = []
        for c in cmds:
            out = [b'*%d\r\n' % len(c)]
            for a in c:
                if not isinstance(a, bytes): a = str(a).encode()
                out.append(b'$%d\r\n%s\r\n' % (len(a), a))
            buf.append(b''.join(out))
        self.s.sendall(b''.join(buf))
        return [self.read() for _ in cmds]
