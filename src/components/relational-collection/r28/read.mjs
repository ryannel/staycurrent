export function commonRead(timestamp, bSafe) {
  const aSafe=120;
  const safe=timestamp<=aSafe&&timestamp<=bSafe;
  const purchased=timestamp>=110;
  return {safe,stock:purchased?0:1,order:purchased?'103 · pending':'103 absent',aSafe,bSafe,timestamp};
}
