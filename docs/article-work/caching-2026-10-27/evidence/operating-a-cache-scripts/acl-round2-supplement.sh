#!/bin/bash
# B2 supplementary checks: what fails without the replica user, and how users change later.
BIN=/opt/homebrew/opt/redis/bin
T=$(mktemp -d "$1/aclrun2.XXXX")
cli() { local port=$1; shift; "$BIN/redis-cli" -p "$port" --no-auth-warning "$@" 2>&1 | tr '\n' ' '; echo; }
A="--user admin --pass admin-password"
cat > "$T/users.acl" <<'ACL'
user admin on >admin-password ~* &* +@all
user shop on >shop-password ~app:* +@read +@write +@connection +@transaction +@scripting -@dangerous
user default off
ACL
mkdir "$T/a" "$T/b"; cp "$T/users.acl" "$T/a/"; cp "$T/users.acl" "$T/b/"
"$BIN/redis-server" --port 7111 --dir "$T/a" --save '' --aclfile "$T/a/users.acl" --daemonize yes --logfile "$T/a/log"
"$BIN/redis-server" --port 7181 --dir "$T/b" --save '' --aclfile "$T/b/users.acl" --replicaof 127.0.0.1 7111 --daemonize yes --logfile "$T/b/log"
sleep 3
echo "replica with no masteruser/masterauth, primary's default user off: $(cli 7181 $A INFO replication | grep -o 'master_link_status:[a-z]*')"
echo "replica log: $(grep -m1 -i -E 'noauth|auth' $T/b/log | cut -c30-)"
echo "CONFIG SET aclfile at run time => $(cli 7111 $A CONFIG SET aclfile /tmp/x.acl)"
echo "user metrics on >metrics-password +info +ping" >> "$T/a/users.acl"
echo "edit the file, then ACL LOAD => $(cli 7111 $A ACL LOAD); metrics INFO => $(cli 7111 --user metrics --pass metrics-password INFO server | cut -c1-30)"
echo "default user after ACL LOAD: $(cli 7111 $A ACL GETUSER default | cut -c1-60)"
"$BIN/redis-server" --port 7182 --dir "$T" --save '' --daemonize yes --logfile "$T/c.log"; sleep 1
echo "server started without aclfile: ACL SAVE => $(cli 7182 ACL SAVE)"
for p in 7111 7181; do cli $p $A SHUTDOWN NOSAVE >/dev/null; done; cli 7182 SHUTDOWN NOSAVE >/dev/null
sleep 1; rm -rf "$T"; echo "data deleted: $( [ -d "$T" ] && echo no || echo yes )"
