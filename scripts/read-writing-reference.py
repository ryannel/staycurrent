#!/usr/bin/env python3
"""Deliver one complete, bounded part of a fixed writing reference."""

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "src/reference-articles/reading"
PART_LIMIT = 9000


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parts(text):
    result = []
    while text:
        end = min(PART_LIMIT, len(text))
        if end < len(text):
            boundary = text.rfind("\n", end // 2, end)
            if boundary != -1:
                end = boundary + 1
        result.append(text[:end])
        text = text[end:]
    return result


def load_references():
    manifest = json.loads((BUNDLE / "manifest.json").read_text())
    references = {}
    for entry in manifest["references"]:
        source = ROOT / entry["source"]
        reading = BUNDLE / (entry["name"] + ".txt")
        if sha256(source) != entry["source_sha256"]:
            raise ValueError(f"Stale reading export: {source}. Regenerate from its rendered article.")
        if sha256(reading) != entry["text_sha256"]:
            raise ValueError(f"Changed reading export: {reading}. Check its provenance.")
        text = reading.read_text()
        chunks = parts(text)
        assert "".join(chunks) == text
        assert all(0 < len(chunk) <= PART_LIMIT for chunk in chunks)
        references[entry["name"]] = (entry, chunks)
    return references


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("article", nargs="?", choices=["sequences", "indexes", "storage"])
    parser.add_argument("part", nargs="?", type=int)
    args = parser.parse_args()
    try:
        references = load_references()
    except (ValueError, OSError) as exc:
        parser.exit(1, str(exc) + "\n")
    if args.article is None:
        for name, (entry, chunks) in references.items():
            print(f"{name}: {len(chunks)} parts; {entry['characters']} characters; {entry['url_path']}")
        print("Read every part, one tool result at a time with at least 4000 output tokens.")
        print("Check each END marker is delivered; recover missing/truncated output before drafting.")
        print("Text includes complete prose, code, labels and captions. Inspect drawings in the browser too.")
        return
    entry, chunks = references[args.article]
    if args.part is None or not 1 <= args.part <= len(chunks):
        parser.error(f"{args.article} requires a part number from 1 to {len(chunks)}")
    start = sum(len(chunk) for chunk in chunks[:args.part - 1])
    print(f"REFERENCE {args.article} PART {args.part}/{len(chunks)} CHARS {start}:{start + len(chunks[args.part - 1])}")
    print(f"Complete text SHA256 {entry['text_sha256']}; source {entry['source']}")
    print(chunks[args.part - 1], end="")
    print(f"\nEND REFERENCE {args.article} PART {args.part}/{len(chunks)}")


if __name__ == "__main__":
    main()
