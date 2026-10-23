'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const {chat,validate,portFrom}=require('../desktop/npc-llm.cjs');
assert.throws(()=>portFrom('0'));
assert.throws(()=>portFrom('654321'));
assert.throws(()=>validate([{role:'system',content:'x'}]));
assert.throws(()=>validate([{role:'system',content:'x'},{role:'tool',content:'steal'}]));
(async()=>{
 const server=http.createServer((req,res)=>{
  assert.equal(req.url,'/v1/chat/completions');
  assert.equal(req.headers.host.startsWith('127.0.0.1:'),true,'Never sends prompts to remote host');
  let raw='';req.on('data',c=>raw+=c);req.on('end',()=>{
   const p=JSON.parse(raw);
   assert.equal(p.messages[1].content,'The weather?');
   assert.equal(p.stream,false);
   res.writeHead(200,{'Content-Type':'application/json'});
   res.end(JSON.stringify({choices:[{message:{content:'Cold and clear, I should say.'}}]}));
  });
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const reply=await chat([{role:'system',content:'1878'},{role:'user',content:'The weather?'}],{port:server.address().port,timeout:2000});
  assert.equal(reply.text,'Cold and clear, I should say.');
 }finally{await new Promise(resolve=>server.close(resolve))}
 await assert.rejects(chat([{role:'system',content:'1878'},{role:'user',content:'Hello'}],{port:65534,timeout:1200}));
 console.log('PASS loopback-only OpenAI chat transport, failure semantics and limited renderer contract');
})().catch(e=>{console.error(e);process.exitCode=1});
