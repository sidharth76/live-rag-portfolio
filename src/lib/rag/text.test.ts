import assert from 'node:assert/strict';
import test from 'node:test';
import { extractKnownEntities, splitTextIntoChunks } from './text';

test('splits long text into overlapping, stable source chunks', () => {
  const text = Array.from({ length: 240 }, (_, index) => `resume-word-${index}`).join(' ');
  const firstPass = splitTextIntoChunks(text, 'resume.pdf', 2);
  const secondPass = splitTextIntoChunks(text, 'resume.pdf', 2);

  assert.ok(firstPass.length > 1);
  assert.deepEqual(firstPass, secondPass);
  assert.ok(firstPass.every((chunk) => chunk.source === 'resume.pdf' && chunk.page === 2));
  assert.ok(firstPass[1].text.includes(firstPass[0].text.slice(-100)));
});

test('extracts known resume entities without returning absent terms', () => {
  assert.deepEqual(
    extractKnownEntities('Built a Python RAG workflow using Qdrant and Neo4j.'),
    ['RAG', 'Qdrant', 'Neo4j', 'Python'],
  );
});
