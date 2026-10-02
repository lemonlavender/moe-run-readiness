import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const format=()=>readFileSync(new URL('../../skills/moe-run-readiness/references/report-format.md',import.meta.url),'utf8');

test('validation ladder orders every required stage',()=>{
  const body=format();
  const stages=['Configuration review','Single-process smoke','Single-node smoke','Two-node communication trial','Short scale trial','Checkpoint-resume rehearsal','Allocation approval'];
  let cursor=-1;
  for(const stage of stages){const next=body.indexOf(stage);assert.ok(next>cursor,`${stage} must be present and ordered`);cursor=next;}
});

test('every validation stage requires reviewable fields without invented commands',()=>{
  const body=format();
  for(const term of ['Command or procedure','Expected evidence','Owner','Stop condition']) assert.match(body,new RegExp(term,'i'));
  assert.match(body,/do not invent.*command/i);
  assert.match(body,/request.*procedure/i);
});
