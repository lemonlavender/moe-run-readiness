import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const text=()=>readFileSync(new URL('../../skills/moe-run-readiness/SKILL.md',import.meta.url),'utf8');

test('Skill defines bounded readiness verdicts and evidence classes',()=>{
  const body=text();
  for(const term of ['ready-for-staged-run','conditional','blocked','observed','derived','claim','unknown']) assert.match(body,new RegExp(`\\b${term}\\b`));
  assert.match(body,/do not (?:promote|upgrade).*claim/i);
});

test('Skill fixes the full-scale authorization boundary',()=>{
  const body=text();
  assert.match(body,/does not authorize a full-scale training run/i);
  assert.match(body,/human approval/i);
  assert.match(body,/do not run|never execute/i);
});
