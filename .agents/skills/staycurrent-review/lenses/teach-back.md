# Teach-back lens

Tests whether the article teaches what its exit questions demand. It runs in two steps,
carried out by two separate, fresh agents.

## Step 1: answer

**Inputs:** the article's prose (from its built page or its source) and its exit
questions. Nothing else.

Answer each question using only the article. Quote the passage or passages that support
each answer. If the article does not support an answer, write "not in the article" and
say what is missing. Do not use outside knowledge, even when you know the answer: the
point is to find what the article fails to teach.

## Step 2: mark

**Inputs:** the exit questions, step 1's answers and quotes, and the article's sources.

Mark each answer:

- **Supported:** the quotes support a correct answer at the level the question asks.
- **Thin:** the answer is correct, but the quotes only gesture at it, so a reader would
  need to fill the gap themselves.
- **Unsupported:** the article does not equip the reader to answer.
- **Misled:** the quotes support a wrong answer.

## Findings

- Misled → **Critical**.
- Unsupported or Thin → **Medium**: the article is missing teaching it owns.

The check passes when every question is Supported. If a question looks wrong for this
article, for example because it belongs to a neighbouring scope, report that to the
coordinator rather than marking it.
