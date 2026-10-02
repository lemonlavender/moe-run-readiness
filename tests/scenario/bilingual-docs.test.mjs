import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(name)=>readFileSync(new URL(`../../${name}`,import.meta.url),'utf8');

test('both READMEs cover the complete practical workflow',()=>{
  for(const name of ['README.md','README.zh-CN.md']){
    const body=read(name);
    for(const term of ['https://github.com/Devin-AXIS/iPolloWork','1.0.0','ipollowork-plugin','SHA256SUMS.txt','moe-run-readiness']) assert.match(body,new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
    assert.ok((body.match(/^## /gm)||[]).length>=10,`${name} must be complete`);
  }
});

test('public documentation stays product-focused',()=>{
  for(const name of ['README.md','README.zh-CN.md']){
    const body=read(name);
    assert.doesNotMatch(body,/hotspot|热点背景|热点与边界|why this exists|topic and limits/i);
    assert.match(body,/workflow|工作流程/i);
    assert.match(body,/example|示例/i);
    assert.match(body,/validation|验证/i);
  }
});
