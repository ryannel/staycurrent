-- The caller bounds the payload and supplies a positive integer TTL <= 60 seconds.
-- The generation must already exist. Missing metadata fails closed.
local ttl = tonumber(ARGV[3])
if not ttl or ttl < 1 or ttl > 60000 or ttl ~= math.floor(ttl) then
  return redis.error_reply('ERR invalid TTL')
end
local current = redis.call('GET', KEYS[1])
if not current or current ~= ARGV[1] then
  return 0
end
redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3])
return 1
