import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const rules=()=>readFileSync(new URL('../../skills/moe-run-readiness/references/readiness-rules.md',import.meta.url),'utf8');

test('topology review requires explicit world-size consistency',()=>{
  const body=rules();
  assert.match(body,/world size/i);
  assert.match(body,/data parallel.*expert parallel.*pipeline parallel.*tensor parallel/is);
  assert.match(body,/owner/i);
});

test('systems review covers every evidence domain',()=>{
  const body=rules();
  for(const term of ['routing','memory headroom','precision','communication','checkpoint','data','observability']) assert.match(body,new RegExp(term,'i'));
  assert.match(body,/tokens per expert|tokens-per-expert/i);
  assert.match(body,/matching input/i);
  assert.match(body,/GB and GiB.*not interchangeable/i);
  assert.match(body,/absent recovery path.*blocked/i);
});
